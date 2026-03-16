# DEVTINDER API

We are grouping the API and creating one seperate router for each group of api.

// we will create one router that handles below three api

## authRouter

- POST /signup
- POST /login (authentication API)
- POST / logout

// we will create other router that handles below three api

## ProfileRouter

- GET /profile/view (View my own profile data)
- PATCH /profile/edit (edit my own profile data)
- PATCH /profile/password (for edit my own password we are using different API)

// First user should be login..
// then compare existing password with given password
//then allow to update password

## ConnectionRequestRouter

-POST /request/send/interested/:userId (LIKE) // as user we are sending request to profile
-POST /request/send/ignored/:userId (Pass) // as user we are ignoring the profile

-POST /request/review/accepted/requestId // someone has sent request to me
-POST /request/review/rejected/requestId

-GET /user/requests/received (Total request received) // jo logged in user hai usko kitana request receieve huva hai wahi show ho n ki dusree ka..

-GET /user/connections (hmlog ke kitne friend hai...)

-GET / feed - Get Profile of other user in our feed

Status : ignore,interested,accepted,rejected

/feed?page=1&limit=10 => 1-10 .skip(0) &.limit(10)
/feed?page=2&limit=10 => 11-20 .skip(10) &.limit(10)
/feed?page=3&limit=10 => 21-30 .skip(20) &.limit(10)
/feed?page=4&limit=10 => 31-40 .skip(30) &.limit(10)

skip = (page-1)\*limit
