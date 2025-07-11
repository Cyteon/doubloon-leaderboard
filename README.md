# Doubloon Leaderboard

Not much to type here, this is just a nice little leaderboard of the people with the most doubloons in [HighSeas](https://highseas.hackclub.com/)

## How does it work?

There are three sorting modes, current doubloons, all-time doubloons (all doubloons u have ever earned) and spent doubloons \
You can also search for users, and they will appear if they are opted into the leaderboard \
Thanks to [@taciturnaxolotl](https://github.com/taciturnaxolotl) for implementing this on the signpost in PR https://github.com/hackclub/high-seas/pull/997

## Api Routes
### /api/v1/data
**Parameters**:
- ?page=(integer) - Used for pagination, each page is 25 users
- ?sortBy=(current|total|spent) - How to sort the users, before slicing and returning 25 users based on page

**Response**:
```js
{
    users: [
        {
            username: String,
            total_doubloons: Int,
            current_doubloons: Int,
            slack: String,
            id: String
        }
    ],

    pages: Int,
    opted_in: Int,
    time_since_last_update: Int
}
```

### /api/v1/search
**Parameters**:
- ?id=(string) - ID to search by (response will have a "user" object instead of users array)
- ?username=(string) - Username to search by, (will have "users" array of matches)
- ?sortBy=(current|total|spent) - How to sort the matches (if search by username), and what rank to set on the rank property

**Response**:
```js
{
    // If search with ?username
    users: [
        {
            username: String,
            total_doubloons: Int,
            current_doubloons: Int,
            slack: String,
            id: String,
            rank: Int
        }
    ],

    // If search with ?id
    user: {
        username: String,
        total_doubloons: Int,
        current_doubloons: Int,
        slack: String,
        id: String,
        rank: Int
    }

    pages: Int,
    opted_in: Int,
    time_since_last_update: Int
}
```

### /api/v1/graph
**Parameters**:
- ?id=(string) - ID of the user to get graph points for

**Response**:
```js
[
    {
        id: String,
        doubloons: Int,
        timestamp: String // ISO 8601
    }
]
```
