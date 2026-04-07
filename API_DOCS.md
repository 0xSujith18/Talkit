# Talkit API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register User
```http
POST /auth/register
```
**Body:**
```json
{
  "username": "string",
  "name": "string",
  "email": "string",
  "password": "string",
  "phone": "string (optional)",
  "role": "citizen | authority | admin"
}
```

### Login
```http
POST /auth/login
```
**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

### Get Current User
```http
GET /auth/me
```
**Headers:** `Authorization: Bearer <token>`

### Update Profile
```http
PATCH /auth/profile
```
**Body:**
```json
{
  "username": "string",
  "name": "string",
  "bio": "string",
  "phone": "string",
  "location": "string"
}
```

### Request Verification
```http
POST /auth/request-verification
```
**Body:**
```json
{
  "fullName": "string",
  "category": "string",
  "organization": "string",
  "position": "string",
  "idProof": "string (base64)",
  "reason": "string"
}
```

### Delete Account
```http
DELETE /auth/account
```
Schedules account deletion in 7 days.

---

## Posts Endpoints

### Create Post
```http
POST /posts
```
**Rate Limited:** 10 requests per minute
**Body:**
```json
{
  "caption": "string",
  "media": ["string (base64)"],
  "location": {
    "address": "string",
    "coordinates": { "lat": number, "lng": number }
  },
  "category": "complaint | appreciation",
  "hashtags": ["string"]
}
```

### Get Feed
```http
GET /posts/feed?page=1&limit=20
```

### Get Trending Posts
```http
GET /posts/trending
```

### Like/Unlike Post
```http
POST /posts/:id/like
```

### Comment on Post
```http
POST /posts/:id/comment
```
**Body:**
```json
{
  "text": "string"
}
```

### Get Comments
```http
GET /posts/:id/comments
```

### Update Post Status (Authority Only)
```http
PATCH /posts/:id/status
```
**Body:**
```json
{
  "status": "pending | in_progress | resolved"
}
```

### Get Posts by Hashtag
```http
GET /posts/hashtag/:tag
```

### Get User Posts
```http
GET /posts/user/:userId
```

### Update Post
```http
PATCH /posts/:id
```
**Body:**
```json
{
  "caption": "string",
  "hashtags": ["string"]
}
```

### Delete Post
```http
DELETE /posts/:id
```

---

## Reports Endpoints (Structured Civic Reporting)

### Create Report
```http
POST /reports
```
**Body:**
```json
{
  "category": "infrastructure | sanitation | traffic | water | electricity | other",
  "title": "string",
  "description": "string",
  "media": ["string (base64)"] (required),
  "location": {
    "address": "string",
    "coordinates": { "lat": number, "lng": number }
  },
  "mla": "string (optional)",
  "civicBody": "string (optional)",
  "privacy": "public | authorities_only | anonymous"
}
```
**Response:**
```json
{
  "reportId": "TLK-XXXXX-XXXX",
  ...
}
```

### Get Reports
```http
GET /reports?category=&status=&page=1&limit=20
```
- Citizens see only their reports
- Authorities see all reports with filters

### Get Report by ID
```http
GET /reports/:id
```

### Publish Report to Feed
```http
POST /reports/:id/publish
```
Converts report to social post.

### Update Report Status (Authority Only)
```http
PATCH /reports/:id/status
```
**Body:**
```json
{
  "status": "pending | in_progress | resolved",
  "actionProof": "string (base64, optional)"
}
```

### Get Analytics (Authority Only)
```http
GET /reports/analytics/summary
```
**Response:**
```json
{
  "total": number,
  "pending": number,
  "inProgress": number,
  "resolved": number,
  "byCategory": [{ "_id": "category", "count": number }]
}
```

---

## Notifications Endpoints

### Get Notifications
```http
GET /notifications
```

### Mark as Read
```http
PATCH /notifications/:id/read
```

### Mark All as Read
```http
PATCH /notifications/read-all
```

---

## Moderation Endpoints

### Report Content/User
```http
POST /moderation/report
```
**Body:**
```json
{
  "targetType": "post | comment | user",
  "targetId": "string",
  "reason": "spam | harassment | inappropriate | misinformation | other",
  "description": "string (optional)"
}
```

### Get Moderation Reports (Admin Only)
```http
GET /moderation/reports
```

### Review Report (Admin Only)
```http
PATCH /moderation/reports/:id
```
**Body:**
```json
{
  "status": "reviewed | action_taken | dismissed",
  "action": "string"
}
```

---

## Admin Endpoints

### Get Verification Requests
```http
GET /auth/verification-requests
```

### Verify User
```http
POST /auth/verify-user/:userId
```

### Reject Verification
```http
DELETE /auth/verification-request/:id
```

---

## Rate Limiting

- Post creation: 10 requests per minute per user
- General API: No limit (implement as needed)

---

## Error Responses

All errors return:
```json
{
  "error": "Error message"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Server Error

---

## Features Summary

✅ JWT Authentication
✅ Role-based Access Control (Citizen, Authority, Admin)
✅ Social Feed with Posts, Likes, Comments
✅ Trending Algorithm
✅ Hashtag System
✅ Structured Civic Reporting with Geo-tagging
✅ Report ID Generation
✅ Privacy Controls (Public/Authorities Only/Anonymous)
✅ Authority Dashboard with Analytics
✅ Status Tracking (Pending/In Progress/Resolved)
✅ Notification System
✅ Content Moderation & Abuse Reporting
✅ Rate Limiting
✅ Account Deletion (7-day grace period)
✅ Verification System for Authorities
