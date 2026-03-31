import { useEffect, useRef } from 'react';

const DB_URL = 'https://echo-of-time-8a0aa-default-rtdb.firebaseio.com';

/**
 * Subscribes to a Firebase Realtime Database path via Server-Sent Events.
 * The EventSource is recreated only when path or token changes.
 * Callbacks are stored in refs so they can be updated without reopening the connection.
 *
 * Firebase SSE event types:
 *  - put:    full replacement of data at the given path
 *  - patch:  shallow merge of partial data at the given path
 *  - cancel: authentication was revoked; caller should refresh token
 *
 * @param {string|null} path   - Firebase path (e.g. "/uid/active_plan"), null disables subscription
 * @param {string|null} token  - Firebase auth token
 * @param {Function} onPut     - called with { path, data } on put events
 * @param {Function} onPatch   - called with { path, data } on patch events
 * @param {Function} onAuthRevoked - called with no args on cancel events
 */
const useFirebaseSSE = ({ path, token, onPut, onPatch, onAuthRevoked }) => {
    const onPutRef = useRef(onPut);
    const onPatchRef = useRef(onPatch);
    const onAuthRevokedRef = useRef(onAuthRevoked);

    useEffect(() => { onPutRef.current = onPut; }, [onPut]);
    useEffect(() => { onPatchRef.current = onPatch; }, [onPatch]);
    useEffect(() => { onAuthRevokedRef.current = onAuthRevoked; }, [onAuthRevoked]);

    useEffect(() => {
        if (!path || !token) return;

        const es = new EventSource(`${DB_URL}${path}.json?auth=${token}`);

        es.addEventListener('put', (e) => {
            if (!e.data) return;
            onPutRef.current(JSON.parse(e.data));
        });

        es.addEventListener('patch', (e) => {
            if (!e.data) return;
            onPatchRef.current(JSON.parse(e.data));
        });

        es.addEventListener('cancel', () => {
            onAuthRevokedRef.current();
        });

        return () => es.close();
    }, [path, token]);
};

export default useFirebaseSSE;
