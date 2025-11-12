import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    scenarios: {
        smoke: {
            executor: 'ramping-arrival-rate',
            startRate: 5,           // reqs/sec
            timeUnit: '1s',
            preAllocatedVUs: 10,
            stages: [
                { target: 50, duration: '1m' },  // ramp to 50 rps
                { target: 50, duration: '2m' },  // hold
                { target:  0, duration: '30s' }, // ramp down
            ],
        },
    },
    thresholds: {
        http_req_failed: ['rate<0.01'],        // <1% errors
        http_req_duration: ['p(95)<300'],      // p95 < 300ms
    },
};

const BASE = __ENV.BASE || 'http://localhost:8080';
const TOKEN = __ENV.TOKEN;

export default function () {
    // event payload
    const body = JSON.stringify({
        eventType: 'login',
        userId: `u_${__VU}_${Math.floor(Math.random()*1000)}`,
        sessionId: `s_${__ITER}`,
        payload: { ua: 'k6' }
    });

    const headers = {
        'Content-Type': 'application/json',
        ...(TOKEN ? { 'Authorization': `Bearer ${TOKEN}` } : {})
    };

    const res = http.post(`${BASE}/api/v1/events`, body, { headers });

    check(res, {
        'status 200': r => r.status === 200,
        'has id': r => r.json('id') !== undefined,
    });

    sleep(0.2); // a little think time
}
