# Testing Forgot Password Endpoint

## Expected URL
`https://zodduukuwfatmqejxnsf.supabase.co/functions/v1/make-server-cc72773f/forgot-password/send-code`

## Test Steps

1. Open browser console
2. Run this test:

```javascript
const projectId = "zodduukuwfatmqejxnsf"
const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-cc72773f`

console.log('API Base:', API_BASE)
console.log('Full endpoint:', `${API_BASE}/forgot-password/send-code`)

// Test the endpoint
fetch(`${API_BASE}/forgot-password/send-code`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email: 'test@example.com' }),
})
.then(res => res.json())
.then(data => console.log('Response:', data))
.catch(err => console.error('Error:', err))
```

## Check Server Logs

The server should log:
- Password reset requested for: [email]
- Generated reset code: [code]
- Reset code stored successfully in KV
- PASSWORD RESET CODE banner

## Common Issues

1. **CORS Error**: Check if the server has `app.use('*', cors())` at the top
2. **404 Error**: Endpoint path might be wrong
3. **500 Error**: Check server logs for actual error
4. **Network Error**: Supabase Edge Function might not be deployed
