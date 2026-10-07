---
url: https://docs.composio.dev/toolkits/spotify.md
title: https://docs.composio.dev/toolkits/spotify.md
description: 
status: 200
---

\# Spotify

Spotify is a digital music and podcast streaming service with millions of tracks, personalized playlists, and social sharing features

\- \*\*Category:\*\* news & lifestyle
\- \*\*Auth:\*\* OAUTH2
\- \*\*Composio-managed OAuth available?\*\* No
\- \*\*Tools:\*\* 88
\- \*\*Triggers:\*\* 3
\- \*\*Slug:\*\* \`SPOTIFY\`
\- \*\*Version:\*\* 20260721\_00

\## Frequently Asked Questions

\### Why is there no default OAuth app for Spotify?

Composio does not provide a default OAuth app for Spotify. Create your own OAuth app in the \[Spotify Developer Dashboard\](https://developer.spotify.com/dashboard) to use the Spotify toolkit.

\## Tools

\### Add items to playlist

\*\*Slug:\*\* \`SPOTIFY\_ADD\_ITEMS\_TO\_PLAYLIST\`

Add one or more items to a user's playlist.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`uris\` \| string \| Yes \| Spotify URIs of tracks or episodes to add. Accepts both URI types: - Track URI: 'spotify:track:4iV5W9uYEdYUVa79Axb7Rh' - Episode URI: 'spotify:episode:512ojhOuo1ktJprKbVcKyQ' Format options: - Comma-separated string: 'spotify:track:4iV5W9uYEdYUVa79Axb7Rh,spotify:track:1301WleyT98MSxVHPZCA6M' - List of strings: \['spotify:track:4iV5W9uYEdYUVa79Axb7Rh', 'spotify:track:1301WleyT98MSxVHPZCA6M'\] Maximum 100 items per request. Items are added in the order specified. \|
\| \`position\` \| integer \| No \| Zero-based index for item insertion. Examples: - position=0: Insert at the beginning - position=2: Insert at the third position - Omitted (None): Append items to the end (default behavior) \|
\| \`playlist\_id\` \| string \| Yes \| The Spotify ID of the playlist (e.g., '3cEYpjA9oz9GiPac4AsH4n'). Can be found in the playlist URL or obtained from playlist creation/search endpoints. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Add item to playback queue

\*\*Slug:\*\* \`SPOTIFY\_ADD\_ITEM\_TO\_PLAYBACK\_QUEUE\`

Add an item to the end of the user's current playback queue. This API only works for users who have Spotify Premium. The order of execution is not guaranteed when you use this API with other Player API endpoints. Required scope: user-modify-playback-state Note: Only tracks and episodes can be added to the queue. Albums and playlists cannot be added directly.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`uri\` \| string \| Yes \| The Spotify URI of the item to add to the queue. Must be a track or episode URI (e.g., 'spotify:track:4iV5W9uYEdYUVa79Axb7Rh' or 'spotify:episode:512ojhOuo1ktJprKbVcKyQ'). \|
\| \`device\_id\` \| string \| No \| The ID of the device this command is targeting. If not supplied, the user's currently active device is the target. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Change playlist details

\*\*Slug:\*\* \`SPOTIFY\_CHANGE\_PLAYLIST\_DETAILS\`

Change a playlist's name and public/private state. The user must own the playlist. This action allows updating the playlist name, description, public/private status, and collaborative mode. At least one of the optional parameters (name, public, collaborative, description) must be provided. Important constraints: - collaborative can only be set to true on non-public playlists (when public is false) - Requires OAuth scope: playlist-modify-public (for public playlists) or playlist-modify-private (for private playlists) - The playlist must be owned by the authenticated user

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| No \| The new name for the playlist, for example "My New Playlist Title". \|
\| \`public\` \| boolean \| No \| If true the playlist will be public, if false it will be private. \|
\| \`description\` \| string \| No \| Value for playlist description as displayed in Spotify Clients and in the Web API. \|
\| \`playlist\_id\` \| string \| Yes \| The Spotify ID of the playlist to update. Must be a playlist owned by the current user. Playlist IDs are 22-character base62 strings. \|
\| \`collaborative\` \| boolean \| No \| If true, the playlist will become collaborative and other users will be able to modify the playlist in their Spotify client. Note: You can only set collaborative to true on non-public playlists. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Check if user follows artists or users

\*\*Slug:\*\* \`SPOTIFY\_CHECK\_IF\_USER\_FOLLOWS\_ARTISTS\_OR\_USERS\`

Check to see if the current user is following one or more artists or other Spotify users.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ids\` \| string \| Yes \| A comma-separated list of the artist or user Spotify IDs to check. Maximum of 50 IDs per request. Example: '2CIMQHirSU0MQqyYHq0eOx,57dN52uHvrHOxijzpIgu3E' \|
\| \`type\` \| string ("artist" \| "user") \| Yes \| The ID type: either 'artist' or 'user' \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Check if users follow playlist

\*\*Slug:\*\* \`SPOTIFY\_CHECK\_IF\_USERS\_FOLLOW\_PLAYLIST\`

Check if the current authenticated user is following a specified playlist. This endpoint checks whether the authenticated user follows the given playlist. It returns a boolean value indicating whether the user follows the playlist. Important: Despite the parameter being named 'ids', this endpoint only works for checking if the current authenticated user follows a playlist. You cannot check if arbitrary users follow a playlist. Note: The playlist must be public or the requesting user must own the playlist.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ids\` \| string \| Yes \| The Spotify user ID to check if they follow the playlist. Must be the current authenticated user's ID. Single user ID only (e.g., 'jmperezperez'). Note: While the API parameter is named 'ids', only the authenticated user can be checked. \|
\| \`playlist\_id\` \| string \| Yes \| The Spotify ID of the playlist to check followers for. A 22-character alphanumeric string (e.g., '3cEYpjA9oz9GiPac4AsH4n'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Check user s saved albums

\*\*Slug:\*\* \`SPOTIFY\_CHECK\_USER\_S\_SAVED\_ALBUMS\`

Check if one or more albums is already saved in the current Spotify user's 'Your Music' library.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ids\` \| string \| Yes \| A comma-separated list of Spotify album IDs. Maximum: 20 IDs. Example: '382ObEPsp2rxGrnsizN5TX,1A2GTWGtFfWp7KSQTwWOyo' \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Check user s saved audiobooks

\*\*Slug:\*\* \`SPOTIFY\_CHECK\_USER\_S\_SAVED\_AUDIOBOOKS\`

Check if one or more audiobooks are already saved in the current Spotify user's library. Returns an array of boolean values indicating whether each audiobook (by ID) is saved in the user's library. Requires user-library-read scope.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ids\` \| string \| Yes \| A comma-separated list of Spotify audiobook IDs to check. Maximum 50 IDs. Example: '18yVqkdbdRvS24c0Ilj2ci,1HGw3J3NxZO1TP1BTtVhpZ' \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Check User's Saved Episodes

\*\*Slug:\*\* \`SPOTIFY\_CHECK\_USER\_S\_SAVED\_EPISODES\`

Check if one or more podcast episodes are saved in the current Spotify user's 'Your Episodes' library. Returns an array of boolean values corresponding to each episode ID provided. \*\*Required OAuth Scope:\*\* user-library-read \*\*Note:\*\* This endpoint is currently in beta and may change without notice.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ids\` \| string \| Yes \| A comma-separated list of Spotify episode IDs to check (e.g., '77o6BIVlYM3msb4MMIL1jH,0Q86acNRm6V9GYx55SXKwf'). Maximum: 50 IDs. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Check user's saved shows

\*\*Slug:\*\* \`SPOTIFY\_CHECK\_USER\_S\_SAVED\_SHOWS\`

Check if one or more shows is already saved in the current Spotify user's library. This endpoint checks whether the specified shows are saved in the authenticated user's library. It returns a list of boolean values, one for each show ID provided, indicating whether that show is saved.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ids\` \| string \| Yes \| A comma-separated list of the Spotify IDs for the shows. Maximum: 50 IDs. Example: '5CfCWKI5pZ28U0uOzXkDHe,5as3aKmN2k11yfDDDSrvaZ' \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Check User's Saved Tracks

\*\*Slug:\*\* \`SPOTIFY\_CHECK\_USER\_S\_SAVED\_TRACKS\`

Check if one or more tracks is already saved in the current Spotify user's 'Your Music' library. Returns an array of boolean values indicating whether each track is saved (true) or not (false), in the same order as the requested IDs.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ids\` \| string \| Yes \| A comma-separated list of Spotify track IDs to check. Maximum of 50 IDs per request. Example: '7ouMYWpwJ422jRcDASZB7P,4VqPOruhp5EdPBeR92t6lQ' \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create playlist

\*\*Slug:\*\* \`SPOTIFY\_CREATE\_PLAYLIST\`

Create a playlist for a Spotify user. (The playlist will be empty until you \[add tracks\](/documentation/web-api/reference/add-tracks-to-playlist).) Each user is generally limited to a maximum of 11000 playlists.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| The name for the new playlist, for example \`"Your Coolest Playlist"\`. This name does not need to be unique; a user may have several playlists with the same name. \|
\| \`public\` \| boolean \| No \| Defaults to \`true\`. If \`true\` the playlist will be public, if \`false\` it will be private. To be able to create private playlists, the user must have granted the \`playlist-modify-private\` \[scope\](/documentation/web-api/concepts/scopes/#list-of-scopes) \|
\| \`user\_id\` \| string \| Yes \| The Spotify user ID for whom to create the playlist. This can be obtained from the user's profile (e.g., using get\_current\_user\_s\_profile action). \|
\| \`description\` \| string \| No \| The playlist description as displayed in Spotify Clients and in the Web API. Optional field for providing additional context about the playlist. \|
\| \`collaborative\` \| boolean \| No \| Defaults to \`false\`. If \`true\` the playlist will be collaborative. \_\*\*Note\*\*: to create a collaborative playlist you must also set \`public\` to \`false\`. To create collaborative playlists you must have granted \`playlist-modify-private\` and \`playlist-modify-public\` \[scopes\](/documentation/web-api/concepts/scopes/#list-of-scopes).\_ \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Follow artists or users

\*\*Slug:\*\* \`SPOTIFY\_FOLLOW\_ARTISTS\_OR\_USERS\`

Follow one or more artists or Spotify users on behalf of the current authenticated user. This action adds the specified artists or users to the current user's "Following" list, making their content appear in the user's personalized feed. The operation is idempotent - attempting to follow an already-followed artist/user will succeed without error. Required OAuth scope: user-follow-modify Common use cases: - Follow an artist after liking their music - Follow multiple artists at once (up to 50) - Follow other Spotify users to see their public playlists and activity Note: Artist IDs can be obtained from search results, track objects, or album objects. User IDs can be obtained from user profile endpoints or playlist owner information.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ids\` \| string \| Yes \| A comma-separated list of Spotify IDs for the artists or users to follow. Each ID is a 22-character alphanumeric string (e.g., '3WrFJ7ztbogyGnTHbHJFl2' for The Beatles). You can specify multiple IDs separated by commas (e.g., '3WrFJ7ztbogyGnTHbHJFl2,1dfeR4HaWDbWqFHLkxsg1d'). Maximum 50 IDs per request. Obtain artist IDs from search results or artist/track objects. \|
\| \`type\` \| string ("artist" \| "user") \| Yes \| The type of Spotify entity to follow. Use 'artist' to follow musical artists/bands, or 'user' to follow other Spotify users. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Follow playlist

\*\*Slug:\*\* \`SPOTIFY\_FOLLOW\_PLAYLIST\`

Add the current user as a follower of a playlist. This action adds the current user as a follower of a specified playlist. The 'public' parameter controls whether the playlist will appear in the user's public profile (visible to others) or remain private (only visible to the user). This operation is idempotent - if the user is already following the playlist, the operation will still succeed without error. Required OAuth scopes: - playlist-modify-public: For following playlists publicly - playlist-modify-private: For following playlists privately Note: Following a playlist does not make you its owner. You can follow any playlist (public, private, or collaborative) if you know its Spotify ID.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`public\` \| boolean \| No \| Defaults to \`true\`. If \`true\` the playlist will be included in user's public playlists, if \`false\` it will remain private. \|
\| \`playlist\_id\` \| string \| Yes \| The Spotify ID of the playlist to follow. This is a 22-character base62 string that uniquely identifies the playlist (e.g., '37i9dQZF1DXcBWIGoYBM5M'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get a chapter

\*\*Slug:\*\* \`SPOTIFY\_GET\_A\_CHAPTER\`

Get Spotify catalog information for a single audiobook chapter including name, description, duration, release date, narrators, and playback information. Audiobook chapters are only available within the US, UK, Canada, Ireland, New Zealand and Australia markets. Use this action to retrieve detailed metadata about a specific chapter when you have its Spotify ID.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The Spotify ID for the chapter. Chapter IDs are 22-character base62 strings (e.g., '0D5wENdkdwbqlrHoaJ9g29'). You can obtain chapter IDs from the get audiobook chapters endpoint or from Spotify URLs/URIs. \|
\| \`market\` \| string \| No \| An ISO 3166-1 alpha-2 country code (e.g., 'US', 'GB', 'CA'). Chapters are only available in US, UK, CA, IE, NZ, and AU markets. If specified, only content available in that market is returned. If not specified, the user's account market is used. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Album Details

\*\*Slug:\*\* \`SPOTIFY\_GET\_ALBUM\`

Get Spotify catalog information for a single album. Returns comprehensive album data including metadata, track listing, artist information, cover artwork, popularity score, and availability by market. Use this to fetch details about any album in Spotify's catalog using its unique album ID.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The Spotify ID of the album. Album IDs are 22-character base62 strings (e.g., '4aawyAB9vmqN3uQ7FjRGTy' for a valid album). You can obtain album IDs from search results, new releases, or artist album listings. \|
\| \`market\` \| string \| No \| An ISO 3166-1 alpha-2 country code (e.g., 'US', 'GB', 'DE'). If specified, only content available in that market is returned. Useful for checking regional availability. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get album tracks

\*\*Slug:\*\* \`SPOTIFY\_GET\_ALBUM\_TRACKS\`

Get Spotify catalog information about an album's tracks. Optional parameters can be used to limit the number of tracks returned.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The Spotify ID of the album. This must be an album ID, not a track, artist, or playlist ID. Album IDs are 22-character base62 strings (e.g., '0ETFjACtuP2ADo6LFhL6HN'). You can obtain album IDs from the search endpoint or from album objects returned by other endpoints. \|
\| \`limit\` \| integer \| No \| The maximum number of tracks to return. Default: 20. Minimum: 1. Maximum: 50. \|
\| \`market\` \| string \| No \| An ISO 3166-1 alpha-2 country code (e.g., 'US', 'GB', 'CA'). If specified, only content available in that market is returned. If a valid user access token is provided, the country associated with the user account takes priority over this parameter. If not specified, tracks available in all markets are returned. \|
\| \`offset\` \| integer \| No \| The index of the first track to return. Default: 0 (the first track). Use with limit to paginate through tracks. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get an audiobook

\*\*Slug:\*\* \`SPOTIFY\_GET\_AN\_AUDIOBOOK\`

Get Spotify catalog information for a single audiobook. Audiobooks are only available within the US, UK, Canada, Ireland, New Zealand and Australia markets.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The Spotify ID for the audiobook. Audiobook IDs are 22-character base62 strings (e.g., '7iHfbu1YPACw6oZPAFJtqe'). You can obtain audiobook IDs from the search endpoint or from Spotify URLs/URIs. \|
\| \`market\` \| string \| No \| An ISO 3166-1 alpha-2 country code. Audiobooks are only available in US, UK, CA, IE, NZ, and AU markets. If specified, only content available in that market is returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get artist

\*\*Slug:\*\* \`SPOTIFY\_GET\_ARTIST\`

Get detailed Spotify catalog information for a single artist. Returns comprehensive artist data including the artist's name, genres, follower count, profile images, popularity score (0-100), and links to their Spotify profile. Use this action to retrieve metadata about any artist in the Spotify catalog.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The Spotify ID of the artist. Artist IDs are 22-character base62 strings (e.g., '0OdUWJ0sBjDrqHygGUXeCF'). You can obtain artist IDs from the search endpoint, track objects, album objects, or from Spotify URLs/URIs. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get artist s albums

\*\*Slug:\*\* \`SPOTIFY\_GET\_ARTIST\_S\_ALBUMS\`

Get Spotify catalog information about an artist's albums.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The Spotify ID of the artist. This must be an artist ID, not a track, album, or playlist ID. Artist IDs are 22-character base62 strings (e.g., '0OdUWJ0sBjDrqHygGUXeCF'). You can obtain artist IDs from the search endpoint or from artist objects returned by other endpoints. \|
\| \`limit\` \| integer \| No \| The maximum number of albums to return. Default: 20. Minimum: 1. Maximum: 50. \|
\| \`market\` \| string \| No \| An ISO 3166-1 alpha-2 country code. If specified, only albums available in that market are returned. Example: 'US', 'GB', 'DE'. \|
\| \`offset\` \| integer \| No \| The index of the first album to return. Default: 0 (the first album). Use with limit to paginate through albums. \|
\| \`include\_groups\` \| string \| No \| A comma-separated list of keywords that will be used to filter the response. Valid values are: album, single, appears\_on, compilation. For example: 'album,single'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get artist s related artists

\*\*Slug:\*\* \`SPOTIFY\_GET\_ARTIST\_S\_RELATED\_ARTISTS\`

Get Spotify catalog information about artists similar to a given artist. Similarity is based on analysis of the Spotify community's listening history.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The Spotify ID of the artist. Artist IDs are 22-character base62 strings (e.g., '0OdUWJ0sBjDrqHygGUXeCF'). You can obtain artist IDs from the search endpoint, track objects, album objects, or from Spotify URLs/URIs. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Artist's Top Tracks

\*\*Slug:\*\* \`SPOTIFY\_GET\_ARTIST\_S\_TOP\_TRACKS\`

Get Spotify catalog information about an artist's top tracks by country/market. Returns up to 10 of the artist's most popular tracks in the specified market. Each track includes detailed metadata such as album information, duration, popularity score (0-100), explicit content flag, and preview URLs. Use cases: - Display an artist's most popular songs in a specific region - Build artist profile pages with top tracks - Recommend popular content from an artist to users Note: Track popularity varies by market. The same artist may have different top tracks in different countries based on regional streaming patterns.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The Spotify ID of the artist (e.g., '06HL4z0CvFAxyc27GXpf02'). You can obtain artist IDs from search results or artist endpoints. \|
\| \`market\` \| string \| No \| An ISO 3166-1 alpha-2 country code (e.g., 'US', 'GB', 'JP') specifying which market's top tracks to retrieve. Different markets may return different top tracks based on regional popularity. Defaults to 'US' if not specified. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get audiobook chapters

\*\*Slug:\*\* \`SPOTIFY\_GET\_AUDIOBOOK\_CHAPTERS\`

Get Spotify catalog information about an audiobook's chapters. Audiobooks are only available within the US, UK, Canada, Ireland, New Zealand and Australia markets.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The Spotify ID for the audiobook. Audiobook IDs are 22-character base62 strings (e.g., '7iHfbu1YPACw6oZPAFJtqe'). You can obtain audiobook IDs from the search endpoint or from Spotify URLs/URIs. \|
\| \`limit\` \| integer \| No \| The maximum number of chapters to return. Default: 20. Minimum: 1. Maximum: 50. \|
\| \`market\` \| string \| No \| An ISO 3166-1 alpha-2 country code. Audiobooks are only available in US, UK, CA, IE, NZ, and AU markets. If specified, only chapters available in that market are returned. \|
\| \`offset\` \| integer \| No \| The index of the first chapter to return. Default: 0 (the first chapter). Use with limit to paginate through chapters. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Available Devices

\*\*Slug:\*\* \`SPOTIFY\_GET\_AVAILABLE\_DEVICES\`

Get information about the user's available Spotify Connect devices. Returns a list of devices that can be used for playback, including their names, types (computer, smartphone, speaker), active status, volume levels, and whether they support API control. Useful for checking available playback targets before transferring playback or controlling volume. Requires the 'user-read-playback-state' scope. Note: Some device models are not supported and will not be listed in the API response.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get available genre seeds

\*\*Slug:\*\* \`SPOTIFY\_GET\_AVAILABLE\_GENRE\_SEEDS\`

Get available genre seeds for Spotify recommendations. Returns a list of genre strings that can be used as seed\_genres parameter when requesting music recommendations. These genres represent the full set of available genre seeds on Spotify. No parameters are required for this endpoint. Note: This endpoint is deprecated but still functional as of the current API version.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get available markets

\*\*Slug:\*\* \`SPOTIFY\_GET\_AVAILABLE\_MARKETS\`

Get the list of markets where Spotify is available. Returns an array of ISO 3166-1 alpha-2 country codes.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Category's Playlists

\*\*Slug:\*\* \`SPOTIFY\_GET\_CATEGORY\_S\_PLAYLISTS\`

Get Spotify playlists tagged with a specific category (e.g., 'workout', 'party', 'dinner'). Returns a paginated list of playlists for the specified category. Use the limit and offset parameters to control pagination. Category IDs can be obtained from the Get Several Browse Categories endpoint. NOTE: This endpoint is deprecated as of November 2024 and may return 403 Forbidden for apps without extended quota access that was approved before November 27, 2024. Consider alternative endpoints for new implementations.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Maximum number of playlists to return (0-50, default: 20). \|
\| \`offset\` \| integer \| No \| The index of the first playlist to return for pagination (default: 0, use with limit for paging). \|
\| \`category\_id\` \| string \| Yes \| The Spotify category ID (e.g., 'toplists', 'pop', 'workout', 'party', 'dinner'). Get valid IDs from the Get Several Browse Categories endpoint. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get currently playing track

\*\*Slug:\*\* \`SPOTIFY\_GET\_CURRENTLY\_PLAYING\_TRACK\`

Get the object currently being played on the user's Spotify account.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`market\` \| string \| No \| An ISO 3166-1 alpha-2 country code (e.g., 'US', 'GB'). If provided, only content available in that market will be returned. If a valid user access token is provided, the user's country takes priority. \|
\| \`additional\_types\` \| string \| No \| A comma-separated list of item types your client supports. Valid values are 'track' and 'episode'. Use 'track,episode' to support both tracks and podcast episodes. If not provided, only tracks are returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get current user s playlists

\*\*Slug:\*\* \`SPOTIFY\_GET\_CURRENT\_USER\_S\_PLAYLISTS\`

Get a list of the playlists owned or followed by the current Spotify user. Returns a paginated list of playlists (both public and private) that the current user owns or follows. Each playlist includes basic metadata such as name, description, owner information, track count, images, and collaborative/public status. Use the limit and offset parameters to paginate through results. The response includes pagination links (next/previous) for easier navigation through large result sets.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| The maximum number of playlists to return. Valid range: 1-50. Default: 20. \|
\| \`offset\` \| integer \| No \| The index of the first playlist to return (for pagination). Use with limit to retrieve playlists in batches. Valid range: 0-100,000. Default: 0. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get current user s profile

\*\*Slug:\*\* \`SPOTIFY\_GET\_CURRENT\_USER\_S\_PROFILE\`

Get detailed profile information about the current authenticated user. This endpoint returns comprehensive user profile data including display name, email address, country, subscription level (premium/free), explicit content settings, profile images, follower count, and Spotify URIs. Required OAuth scopes: - user-read-private: Required to access country, product (subscription level), and explicit content settings - user-read-email: Required to access the user's email address Returns a private user object with all available profile information for the authenticated user.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get episode

\*\*Slug:\*\* \`SPOTIFY\_GET\_EPISODE\`

Get Spotify catalog information for a single podcast episode identified by its unique Spotify ID. This endpoint retrieves detailed information about a podcast episode including its name, description, duration, release date, cover art, show information, and playback status. It can also return the user's resume point if the user-read-playback-position scope is authorized. Episodes are podcast content on Spotify. Use this endpoint to get metadata and playback information for a specific episode when you have its Spotify ID.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The Spotify ID for the episode (22-character alphanumeric string). Example: '512ojhOuo1ktJprKbVcKyQ' \|
\| \`market\` \| string \| No \| An ISO 3166-1 alpha-2 country code (e.g., 'US', 'GB', 'ES'). If provided, only content available in that market will be returned. If a valid user access token is specified in the request header, the user's country takes priority. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get featured playlists

\*\*Slug:\*\* \`SPOTIFY\_GET\_FEATURED\_PLAYLISTS\`

Get a list of Spotify's editorially curated featured playlists. These are the playlists shown on a Spotify player's 'Browse' tab and are updated regularly by Spotify's editorial team. The response includes a localized message and a paginated list of simplified playlist objects.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Maximum number of featured playlists to return. Valid range: 1-50. Default: 20. \|
\| \`locale\` \| string \| No \| The desired language, consisting of an ISO 639-1 language code and an ISO 3166-1 alpha-2 country code, joined by an underscore. Example: 'es\_MX' for Spanish (Mexico), 'sv\_SE' for Swedish (Sweden), 'en\_US' for English (United States). If not supplied or if the specified locale is not available, defaults to American English. \|
\| \`offset\` \| integer \| No \| The index of the first item to return for pagination (default: 0, use with limit). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get followed artists

\*\*Slug:\*\* \`SPOTIFY\_GET\_FOLLOWED\_ARTISTS\`

Get all artists followed by the current user. Returns a cursor-paginated list of artist objects with full details including name, genres, popularity, images, and follower counts. Use the 'after' parameter to navigate through pages of results. Requires the 'user-follow-read' authorization scope.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`type\` \| string ("artist") \| Yes \| The ID type for the follow operation. Currently only 'artist' is supported by the Spotify API. \|
\| \`after\` \| string \| No \| The cursor for pagination. Provide the last artist ID from the previous response to retrieve the next page of results. \|
\| \`limit\` \| integer \| No \| Maximum number of items to return per request. Range: 0-50. Default: 20. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get new releases

\*\*Slug:\*\* \`SPOTIFY\_GET\_NEW\_RELEASES\`

Get a list of new album releases featured in Spotify (shown, for example, on a Spotify player's "Browse" tab).

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Maximum number of items to return. Must be between 1 and 50 (default: 20). \|
\| \`offset\` \| integer \| No \| The index of the first item to return. Use with limit for pagination (default: 0, must be >= 0). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get playback state

\*\*Slug:\*\* \`SPOTIFY\_GET\_PLAYBACK\_STATE\`

Get information about the user's current playback state, including track or episode, progress, and active device. Returns detailed playback information when content is actively playing, including the current track/episode, playback progress, device details, repeat/shuffle state, and playback context. Returns HTTP 204 (No Content) when nothing is currently playing. Requires OAuth scope: user-read-playback-state

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`market\` \| string \| No \| An ISO 3166-1 alpha-2 country code (e.g., 'US', 'GB', 'JP'). If provided, only content available in that market will be returned. If not specified, content is based on the user's account country. \|
\| \`additional\_types\` \| string \| No \| Comma-separated list of item types to return beyond the default 'track'. Valid values: 'track', 'episode'. Example: 'track,episode' to include both tracks and episodes in the response. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get playlist

\*\*Slug:\*\* \`SPOTIFY\_GET\_PLAYLIST\`

Get a playlist owned by a Spotify user. This endpoint retrieves detailed information about a specific Spotify playlist, including its metadata (name, description, public/collaborative status), owner information, cover images, and the tracks/episodes it contains. The response includes a paginated tracks object with full details about each item in the playlist. Required OAuth scope: playlist-read-private (for private playlists) or playlist-read-collaborative (for collaborative playlists). Public playlists can be accessed without special scopes.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`fields\` \| string \| No \| Filters for the query: a comma-separated list of the fields to return. If omitted, all fields are returned. For example, to get just the playlist's name and tracks: 'name,tracks'. Useful for reducing response size and improving performance. \|
\| \`market\` \| string \| No \| An ISO 3166-1 alpha-2 country code (e.g., 'US', 'GB'). If provided, only content available in that market will be returned. If a user's access token is used, the user's country takes priority. \|
\| \`playlist\_id\` \| string \| Yes \| The Spotify ID of the playlist (e.g., '3cEYpjA9oz9GiPac4AsH4n') \|
\| \`additional\_types\` \| string \| No \| A comma-separated list of item types to return in the playlist's tracks. Supported values: 'track', 'episode'. By default, only 'track' items are returned. To include both tracks and podcast episodes, use 'track,episode'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get playlist cover image

\*\*Slug:\*\* \`SPOTIFY\_GET\_PLAYLIST\_COVER\_IMAGE\`

Get the current image(s) associated with a specific playlist. Returns an array of image objects containing the URL, height, and width of each cover image. The array may be empty if the playlist has no cover image, or contain up to three images returned by size in descending order. Note: The source URL for the image is temporary and will expire in less than a day.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`playlist\_id\` \| string \| Yes \| The Spotify ID of the playlist (e.g., '3cEYpjA9oz9GiPac4AsH4n'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get playlist items

\*\*Slug:\*\* \`SPOTIFY\_GET\_PLAYLIST\_ITEMS\`

Get full details of the items of a playlist owned by a Spotify user. This endpoint retrieves the tracks and/or episodes in a playlist. It supports pagination and allows filtering the response fields for optimization.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50. \|
\| \`fields\` \| string \| No \| Comma-separated list of fields to return, using dot notation for nested fields. Reduces response size by returning only specified fields (e.g., 'items(track(name,id))' returns only track names and IDs). \|
\| \`market\` \| string \| No \| An ISO 3166-1 alpha-2 country code (e.g., 'US', 'GB', 'CA'). If specified, only items available in that market are returned. \|
\| \`offset\` \| integer \| No \| The index of the first item to return. Default: 0 (the first item). \|
\| \`playlist\_id\` \| string \| Yes \| The Spotify ID of the playlist. This is a 22-character base62 string (e.g., '37i9dQZF1DXcBWIGoYBM5M' for Today's Top Hits). \|
\| \`additional\_types\` \| string \| No \| Comma-separated list of item types to include beyond tracks. Valid values: 'track', 'episode'. Use 'track,episode' to retrieve both podcast episodes and music tracks from the playlist. Default behavior (None) returns only tracks. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get recently played tracks

\*\*Slug:\*\* \`SPOTIFY\_GET\_RECENTLY\_PLAYED\_TRACKS\`

Get tracks from the current user's recently played tracks. \_\*\*Note\*\*: Currently doesn't support podcast episodes.\_

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`after\` \| integer \| No \| A Unix timestamp in milliseconds. Returns all items after (but not including) this cursor position. If 'after' is specified, 'before' must not be specified. \|
\| \`limit\` \| integer \| No \| The maximum number of items to return. Minimum: 1. Maximum: 50. Default: 20. \|
\| \`before\` \| integer \| No \| A Unix timestamp in milliseconds. Returns all items before (but not including) this cursor position. If 'before' is specified, 'after' must not be specified. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get recommendations

\*\*Slug:\*\* \`SPOTIFY\_GET\_RECOMMENDATIONS\`

Get track recommendations based on seed artists, genres, and/or tracks. At least one seed is required (up to 5 total). Optionally tune recommendations with audio feature parameters (acousticness, danceability, energy, etc.). IMPORTANT: This endpoint requires Spotify Extended API Access (restricted since Nov 27, 2024). Accounts without extended access will receive a 404 error. See: https://developer.spotify.com/blog/2024-11-27-changes-to-the-web-api Returns a list of recommended tracks with full track metadata including artists, album info, and audio features.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Number of tracks to return (1-100, default: 20) \|
\| \`market\` \| string \| No \| ISO 3166-1 alpha-2 country code (e.g., 'US', 'GB'). Filters results to those available in the specified market \|
\| \`max\_key\` \| integer \| No \| Maximum musical key (0-11, using Pitch Class notation: 0=C, 1=C#, 2=D, etc.) \|
\| \`min\_key\` \| integer \| No \| Minimum musical key (0-11, using Pitch Class notation: 0=C, 1=C#, 2=D, etc.) \|
\| \`max\_mode\` \| integer \| No \| Maximum modality (0=minor, 1=major) \|
\| \`min\_mode\` \| integer \| No \| Minimum modality (0=minor, 1=major) \|
\| \`max\_tempo\` \| number \| No \| Maximum tempo in beats per minute (BPM, e.g., 60 for slow, 120 for moderate, 180 for fast) \|
\| \`min\_tempo\` \| number \| No \| Minimum tempo in beats per minute (BPM, e.g., 60 for slow, 120 for moderate, 180 for fast) \|
\| \`max\_energy\` \| number \| No \| Maximum energy value (0.0 to 1.0). Higher values indicate more energetic, fast, loud tracks \|
\| \`min\_energy\` \| number \| No \| Minimum energy value (0.0 to 1.0). Higher values indicate more energetic, fast, loud tracks \|
\| \`target\_key\` \| integer \| No \| Target musical key (0-11, using Pitch Class notation: 0=C, 1=C#, 2=D, etc.) \|
\| \`max\_valence\` \| number \| No \| Maximum valence value (0.0 to 1.0). Higher values indicate more positive, cheerful tracks \|
\| \`min\_valence\` \| number \| No \| Minimum valence value (0.0 to 1.0). Higher values indicate more positive, cheerful tracks \|
\| \`seed\_genres\` \| string \| No \| Comma-separated list of genre names to use as seeds (e.g., 'pop,rock,indie'). Use get\_available\_genre\_seeds action to see available genres. Up to 5 total seeds across all seed types \|
\| \`seed\_tracks\` \| string \| No \| Comma-separated list of Spotify track IDs to use as seeds (e.g., '0c6xIDDpzE81m2q797ordA,3n3Ppam7vgaVa1iaRUc9Lp'). Up to 5 total seeds across all seed types \|
\| \`target\_mode\` \| integer \| No \| Target modality (0=minor, 1=major) \|
\| \`max\_liveness\` \| number \| No \| Maximum liveness value (0.0 to 1.0). Higher values indicate tracks likely recorded live with audience \|
\| \`max\_loudness\` \| number \| No \| Maximum loudness in decibels (typically -60 to 0). Higher values indicate louder tracks \|
\| \`min\_liveness\` \| number \| No \| Minimum liveness value (0.0 to 1.0). Higher values indicate tracks likely recorded live with audience \|
\| \`min\_loudness\` \| number \| No \| Minimum loudness in decibels (typically -60 to 0). Higher values indicate louder tracks \|
\| \`seed\_artists\` \| string \| No \| Comma-separated list of Spotify artist IDs to use as seeds (e.g., '4NHQUGzhtTLFvgF5SZesLK,06HL4z0CvFAxyc27GXpf02'). Up to 5 total seeds across all seed types \|
\| \`target\_tempo\` \| number \| No \| Target tempo in beats per minute (BPM). Recommendations will aim for this tempo \|
\| \`target\_energy\` \| number \| No \| Target energy value (0.0 to 1.0). Recommendations will aim for this energy level \|
\| \`max\_popularity\` \| integer \| No \| Maximum popularity (0-100). Higher values indicate more popular tracks \|
\| \`min\_popularity\` \| integer \| No \| Minimum popularity (0-100). Higher values indicate more popular tracks \|
\| \`target\_valence\` \| number \| No \| Target valence value (0.0 to 1.0). Recommendations will aim for this valence level \|
\| \`max\_duration\_ms\` \| integer \| No \| Maximum track duration in milliseconds (e.g., 300000 for 5 minutes) \|
\| \`max\_speechiness\` \| number \| No \| Maximum speechiness value (0.0 to 1.0). Higher values indicate tracks with more spoken words \|
\| \`min\_duration\_ms\` \| integer \| No \| Minimum track duration in milliseconds (e.g., 180000 for 3 minutes) \|
\| \`min\_speechiness\` \| number \| No \| Minimum speechiness value (0.0 to 1.0). Higher values indicate tracks with more spoken words \|
\| \`target\_liveness\` \| number \| No \| Target liveness value (0.0 to 1.0). Recommendations will aim for this liveness level \|
\| \`target\_loudness\` \| number \| No \| Target loudness in decibels. Recommendations will aim for this loudness level \|
\| \`max\_acousticness\` \| number \| No \| Maximum acousticness value (0.0 to 1.0). Higher values indicate more acoustic content \|
\| \`max\_danceability\` \| number \| No \| Maximum danceability value (0.0 to 1.0). Higher values indicate tracks more suitable for dancing \|
\| \`min\_acousticness\` \| number \| No \| Minimum acousticness value (0.0 to 1.0). Higher values indicate more acoustic content \|
\| \`min\_danceability\` \| number \| No \| Minimum danceability value (0.0 to 1.0). Higher values indicate tracks more suitable for dancing \|
\| \`target\_popularity\` \| integer \| No \| Target popularity (0-100). Recommendations will aim for this popularity level \|
\| \`max\_time\_signature\` \| integer \| No \| Maximum time signature (number of beats per measure, typically 3-7) \|
\| \`min\_time\_signature\` \| integer \| No \| Minimum time signature (number of beats per measure, typically 3-7) \|
\| \`target\_duration\_ms\` \| integer \| No \| Target track duration in milliseconds. Recommendations will aim for this duration \|
\| \`target\_speechiness\` \| number \| No \| Target speechiness value (0.0 to 1.0). Recommendations will aim for this speechiness level \|
\| \`target\_acousticness\` \| number \| No \| Target acousticness value (0.0 to 1.0). Recommendations will aim for this acousticness level \|
\| \`target\_danceability\` \| number \| No \| Target danceability value (0.0 to 1.0). Recommendations will aim for this danceability level \|
\| \`max\_instrumentalness\` \| number \| No \| Maximum instrumentalness value (0.0 to 1.0). Higher values indicate tracks with no vocals \|
\| \`min\_instrumentalness\` \| number \| No \| Minimum instrumentalness value (0.0 to 1.0). Higher values indicate tracks with no vocals \|
\| \`target\_time\_signature\` \| integer \| No \| Target time signature (number of beats per measure). Recommendations will aim for this time signature \|
\| \`target\_instrumentalness\` \| number \| No \| Target instrumentalness value (0.0 to 1.0). Recommendations will aim for this instrumentalness level \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get several albums

\*\*Slug:\*\* \`SPOTIFY\_GET\_SEVERAL\_ALBUMS\`

Get Spotify catalog information for multiple albums identified by their Spotify IDs. Returns detailed album data including name, artists, tracks, release date, images, and more. Maximum 20 album IDs per request.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ids\` \| string \| Yes \| A comma-separated list of Spotify album IDs. Maximum 20 IDs allowed. Example: '382ObEPsp2rxGrnsizN5TX,1A2GTWGtFfWp7KSQTwWOyo' \|
\| \`market\` \| string \| No \| An ISO 3166-1 alpha-2 country code (e.g., 'US', 'GB', 'DE'). If provided, only content available in that market will be returned. If not provided, content availability is based on the user's account. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get several artists

\*\*Slug:\*\* \`SPOTIFY\_GET\_SEVERAL\_ARTISTS\`

Get Spotify catalog information for several artists based on their Spotify IDs.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ids\` \| string \| Yes \| A comma-separated list of Spotify artist IDs (e.g., '2CIMQHirSU0MQqyYHq0eOx,57dN52uHvrHOxijzpIgu3E'). Maximum: 50 IDs. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get several audiobooks

\*\*Slug:\*\* \`SPOTIFY\_GET\_SEVERAL\_AUDIOBOOKS\`

Retrieve Spotify catalog information for multiple audiobooks in a single request. This action fetches detailed metadata for up to 50 audiobooks at once using their Spotify IDs. Each audiobook object includes: - Title, description, and edition information - Authors and narrators - Chapter information and count - Cover images in multiple sizes - Language and market availability - Publisher and copyright details Audiobooks that don't exist or are unavailable in the requested market will appear as null in the response array (not omitted). \*\*Important\*\*: Audiobooks are only available in US, UK, Canada, Ireland, New Zealand, and Australia markets. Specify the market parameter to ensure content availability for your target region. \*\*Use Cases\*\*: - Bulk retrieval of audiobook metadata - Validating audiobook availability across markets - Building audiobook catalogs or collections - Displaying audiobook details in applications

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ids\` \| string \| Yes \| A comma-separated list of Spotify IDs for the audiobooks. Maximum: 50 IDs. Audiobook IDs are 22-character base62 strings (e.g., '18yVqkdbdRvS24c0Ilj2ci,1HGw3J3NxZO1TP1BTtVhpZ'). \|
\| \`market\` \| string \| No \| An ISO 3166-1 alpha-2 country code. Audiobooks are only available in US, UK, CA, IE, NZ, and AU markets. If specified, only content available in that market is returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get several browse categories

\*\*Slug:\*\* \`SPOTIFY\_GET\_SEVERAL\_BROWSE\_CATEGORIES\`

Get a list of categories used to tag items in Spotify (on, for example, the Spotify player's "Browse" tab).

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Maximum number of categories to return (1-50, default: 20). \|
\| \`locale\` \| string \| No \| Locale for the categories (e.g., 'en\_US', 'es\_ES'). \|
\| \`offset\` \| integer \| No \| The index of the first category to return (default: 0). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get several chapters

\*\*Slug:\*\* \`SPOTIFY\_GET\_SEVERAL\_CHAPTERS\`

Get Spotify catalog information for several audiobook chapters identified by their Spotify IDs. This endpoint allows you to fetch detailed information about up to 50 chapters at once, including chapter metadata, duration, descriptions, images, and parent audiobook information. Chapters are only available within the US, UK, Canada, Ireland, New Zealand and Australia markets.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ids\` \| string \| Yes \| A comma-separated list of Spotify chapter IDs (e.g., '0D5wENdkdwbqlrHoaJ9g29,3ZXb8FKZGU0EHALYX6uCzU'). Chapter IDs are 22-character base62 strings. Maximum: 50 IDs. You can obtain chapter IDs from the get audiobook chapters endpoint or from Spotify URLs/URIs. \|
\| \`market\` \| string \| No \| An ISO 3166-1 alpha-2 country code (e.g., 'US', 'GB', 'CA'). Chapters are only available in US, UK, CA, IE, NZ, and AU markets. If specified, only content available in that market is returned. If not specified, the user's account market is used. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get several episodes

\*\*Slug:\*\* \`SPOTIFY\_GET\_SEVERAL\_EPISODES\`

Get Spotify catalog information for several episodes based on their Spotify IDs.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ids\` \| string \| Yes \| A comma-separated list of the Spotify IDs for the episodes. Maximum: 50 IDs. Episode IDs are 22-character base62 strings (e.g., '77o6BIVlYM3msb4MMIL1jH,0Q86acNRm6V9GYx55SXKwf'). You can obtain episode IDs from the search endpoint, show episodes endpoint, or user's saved episodes endpoint. \|
\| \`market\` \| string \| No \| An ISO 3166-1 alpha-2 country code (e.g., 'US', 'GB', 'DE'). If specified, only episodes available in that market are returned. If a valid user access token is provided, the user's account country takes precedence. If neither market nor user country are specified, content is considered unavailable. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get several shows

\*\*Slug:\*\* \`SPOTIFY\_GET\_SEVERAL\_SHOWS\`

Get Spotify catalog information for several shows (podcasts) based on their Spotify IDs. This endpoint allows you to retrieve detailed information about multiple shows in a single request, with a maximum of 50 show IDs per request.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ids\` \| string \| Yes \| A comma-separated list of Spotify show IDs. Maximum 50 IDs per request. Show IDs are 22-character base62 strings (e.g., '5CfCWKI5pZ28U0uOzXkDHe,5as3aKmN2k11yfDDDSrvaZ'). \|
\| \`market\` \| string \| No \| An ISO 3166-1 alpha-2 country code (e.g., 'US', 'GB', 'ES'). If specified, only content available in that market is returned. If not provided, content is considered available in all markets. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get several tracks

\*\*Slug:\*\* \`SPOTIFY\_GET\_SEVERAL\_TRACKS\`

Get Spotify catalog information for multiple tracks based on their Spotify IDs.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ids\` \| string \| Yes \| A comma-separated list of Spotify track IDs (e.g., '7ouMYWpwJ422jRcDASZB7P,4VqPOruhp5EdPBeR92t6lQ'). Maximum 50 IDs per request. \|
\| \`market\` \| string \| No \| An ISO 3166-1 alpha-2 country code (e.g., 'US', 'GB') to filter tracks by market availability. If not provided, content availability is not filtered by market. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get several tracks audio features

\*\*Slug:\*\* \`SPOTIFY\_GET\_SEVERAL\_TRACKS\_AUDIO\_FEATURES\`

Get audio features for multiple tracks based on their Spotify IDs. Returns audio feature information for multiple tracks including danceability, energy, loudness, speechiness, acousticness, instrumentalness, liveness, valence, tempo, and other musical attributes. Note: This endpoint was deprecated by Spotify on November 27, 2024. Applications created or approved after this date will receive 403 Forbidden errors. Only applications with existing extended mode Web API access that were relying on this endpoint before the cutoff date remain unaffected.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ids\` \| string \| Yes \| A comma-separated list of Spotify track IDs (e.g., '7ouMYWpwJ422jRcDASZB7P,4VqPOruhp5EdPBeR92t6lQ,2takcwOaAZWiXQijPHIx7B'). Maximum 100 IDs per request. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get show

\*\*Slug:\*\* \`SPOTIFY\_GET\_SHOW\`

Get Spotify catalog information for a single show (podcast) identified by its unique Spotify ID.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The Spotify ID of the show. Show IDs are 22-character base62 strings (e.g., '5CfCWKI5pZ28U0uOzXkDHe' for The Joe Rogan Experience). \|
\| \`market\` \| string \| No \| An ISO 3166-1 alpha-2 country code. If specified, only content available in that market is returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get show episodes

\*\*Slug:\*\* \`SPOTIFY\_GET\_SHOW\_EPISODES\`

Get Spotify catalog information about a show's episodes. Optional parameters can be used to limit the number of episodes returned. This endpoint retrieves a paginated list of episodes for a specific podcast/show.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The Spotify ID of the show (podcast). This must be a show ID, not an episode, track, or artist ID. Show IDs are 22-character base62 strings (e.g., '5CfCWKI5pZ28U0uOzXkDHe'). You can obtain show IDs from the search endpoint or from show objects returned by other endpoints. \|
\| \`limit\` \| integer \| No \| The maximum number of episodes to return. Default: 20. Minimum: 1. Maximum: 50. \|
\| \`market\` \| string \| No \| An ISO 3166-1 alpha-2 country code (e.g., 'US', 'GB', 'DE'). If specified, only episodes available in that market are returned. If not specified, the content is considered available in all markets. \|
\| \`offset\` \| integer \| No \| The index of the first episode to return. Default: 0 (the first episode). Use with limit to paginate through episodes. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get single browse category

\*\*Slug:\*\* \`SPOTIFY\_GET\_SINGLE\_BROWSE\_CATEGORY\`

Get a single category used to tag items in Spotify (on, for example, the Spotify player's "Browse" tab). Returns detailed information about the category including its name, icons, and unique identifier.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`locale\` \| string \| No \| The desired language in the format of ISO 639-1 language code and ISO 3166-1 alpha-2 country code joined by underscore (e.g., 'es\_MX' for Spanish Mexico, 'sv\_SE' for Swedish Sweden). If not supplied or if the language is not available, returns the category in American English. \|
\| \`category\_id\` \| string \| Yes \| The Spotify category ID for the category (e.g., 'dinner', 'party', 'pop') \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get the user's queue

\*\*Slug:\*\* \`SPOTIFY\_GET\_THE\_USER\_S\_QUEUE\`

Get the list of tracks and episodes in the user's playback queue. Returns the currently playing track/episode and the queue of upcoming items. This is a read-only operation that does not modify the queue. Requirements: - Spotify Premium subscription required - Requires one of these OAuth scopes: - user-read-currently-playing - user-read-playback-state - An active Spotify session (user must be logged in on a device) Returns: - currently\_playing: The track or episode currently playing (may be null) - queue: List of tracks/episodes queued for playback (may be empty) Common errors: - 403 Forbidden: Premium subscription required or insufficient OAuth scopes - 204 No Content: No active playback session

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get track

\*\*Slug:\*\* \`SPOTIFY\_GET\_TRACK\`

Get Spotify catalog information for a single track identified by its unique Spotify ID.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The Spotify ID of the track. Example: '11dFghVXANMlKmJXsNCbNl' \|
\| \`market\` \| string \| No \| An ISO 3166-1 alpha-2 country code (e.g., 'US', 'GB', 'CA'). If provided, only content available in that market will be returned. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Track's Audio Analysis

\*\*Slug:\*\* \`SPOTIFY\_GET\_TRACK\_S\_AUDIO\_ANALYSIS\`

Get a comprehensive audio analysis for a Spotify track. Returns detailed structural and musical characteristics including: - Meta information (analyzer version, timestamp, processing time) - Track properties (tempo, key, mode, time signature, loudness, duration) - Temporal structure (bars, beats, sections, tatums) - Segments with pitch content and timbre characteristics All timing values are in seconds. Confidence scores range from 0.0 to 1.0. Useful for music analysis, visualization, and recommendation systems.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The Spotify ID for the track. Example: '11dFghVXANMlKmJXsNCbNl' \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get track's audio features

\*\*Slug:\*\* \`SPOTIFY\_GET\_TRACK\_S\_AUDIO\_FEATURES\`

Get audio feature information for a single track identified by its unique Spotify ID. Note: This endpoint was deprecated by Spotify on November 27, 2024. Applications created or approved after this date will receive 403 Forbidden errors. Only applications with existing extended mode Web API access that were relying on this endpoint before the cutoff date remain unaffected.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The Spotify ID for the track (e.g., '11dFghVXANMlKmJXsNCbNl'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get user's playlists

\*\*Slug:\*\* \`SPOTIFY\_GET\_USER\_S\_PLAYLISTS\`

Get a paginated list of playlists owned or followed by a Spotify user. This endpoint retrieves all public playlists for any user. To access private and collaborative playlists, you must have the appropriate OAuth scopes and the user must have authorized your application. Required OAuth scopes for private/collaborative playlists: - playlist-read-private: Required to access user's private playlists - playlist-read-collaborative: Required to access collaborative playlists The response includes playlist metadata such as name, description, owner info, images, track count, and collaboration status. Use the limit and offset parameters to paginate through large playlist collections. Common use cases: - Display a user's public playlist library - Build playlist discovery features - Analyze user's music organization patterns - Enable playlist selection interfaces

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Maximum number of playlists to return in the response. Default: 20, Minimum: 1, Maximum: 50 \|
\| \`offset\` \| integer \| No \| The index of the first playlist to return. Use with limit to paginate through results. Default: 0, Maximum: 100,000 \|
\| \`user\_id\` \| string \| Yes \| The Spotify user ID. This is the unique identifier for a Spotify user, which can be found in their profile URL (e.g., 'spotify', '31l77fd3xhkukh6jvqx8cktqyvw2') \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get user's profile

\*\*Slug:\*\* \`SPOTIFY\_GET\_USER\_S\_PROFILE\`

Get public profile information about a Spotify user. This endpoint retrieves publicly available information for any Spotify user, including their display name, profile images, follower count, and Spotify URIs. Unlike the 'Get Current User's Profile' endpoint, this only returns public data and does not require specific OAuth scopes. Returns a public user object with the user's ID, display name (if available), external URLs, follower count, profile images, and Spotify URI.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`user\_id\` \| string \| Yes \| The Spotify user ID for the user. Example: 'smedjan' \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get user s saved albums

\*\*Slug:\*\* \`SPOTIFY\_GET\_USER\_S\_SAVED\_ALBUMS\`

Get a list of albums saved in the current Spotify user's library ('Your Music'). Returns a paginated list of albums that the user has saved to their library, including when each album was added and full album details (tracks, artists, images, etc.). Supports pagination via limit and offset parameters, and can filter by market availability. Required OAuth scope: user-library-read

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| The maximum number of albums to return. Default: 20. Minimum: 1. Maximum: 50. \|
\| \`market\` \| string \| No \| An ISO 3166-1 alpha-2 country code (e.g., 'US', 'GB'). If provided, returns only content available in that market. If not provided, content is returned based on the user's account settings. \|
\| \`offset\` \| integer \| No \| The index of the first album to return. Use with limit to get the next set of albums. Default: 0. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get user s saved audiobooks

\*\*Slug:\*\* \`SPOTIFY\_GET\_USER\_S\_SAVED\_AUDIOBOOKS\`

Get a list of the audiobooks saved in the current Spotify user's 'Your Music' library.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| The maximum number of audiobooks to return. Default: 20. Minimum: 1. Maximum: 50. \|
\| \`offset\` \| integer \| No \| The index of the first audiobook to return. Default: 0 (the first item). Use with limit to get the next set of audiobooks. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get user's saved episodes

\*\*Slug:\*\* \`SPOTIFY\_GET\_USER\_S\_SAVED\_EPISODES\`

Get a list of episodes saved in the current Spotify user's library. This endpoint retrieves a paginated list of podcast episodes that the authenticated user has saved to their Spotify library. Each item in the response includes the full episode details and the timestamp when it was added to the library. \*\*Required OAuth Scopes:\*\* - user-library-read: Access your saved content - user-read-playback-position: Read your position in content you have played (for resume\_point) \*\*Note:\*\* This endpoint is currently in beta and may change without warning. Please share feedback or issues in the Spotify developer community forum.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| The maximum number of episodes to return. Default: 20. Minimum: 1. Maximum: 50. \|
\| \`market\` \| string \| No \| An ISO 3166-1 alpha-2 country code (e.g., 'US', 'GB', 'ES'). If specified, only episodes available in that market are returned. If a valid user access token is provided, the user's country takes priority over this parameter. \|
\| \`offset\` \| integer \| No \| The index of the first episode to return. Default: 0 (the first episode). Use with limit to paginate through episodes. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get User's Saved Shows

\*\*Slug:\*\* \`SPOTIFY\_GET\_USER\_S\_SAVED\_SHOWS\`

Get a list of shows saved in the current Spotify user's library. Optional parameters can be used to limit the number of shows returned.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| The maximum number of items to return. Default: 20. Range: 1-50. \|
\| \`offset\` \| integer \| No \| The index of the first item to return. Default: 0 (the first item). Use with limit to get the next set of items. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get User's Saved Tracks

\*\*Slug:\*\* \`SPOTIFY\_GET\_USER\_S\_SAVED\_TRACKS\`

Get a list of the songs saved in the current Spotify user's 'Your Music' library. Returns paginated results with track details including album info, artists, duration, and when each track was saved.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| The maximum number of items to return per page. Must be between 1 and 50. Default is 20. \|
\| \`market\` \| string \| No \| An ISO 3166-1 alpha-2 country code (e.g., 'US', 'GB', 'CA'). If provided, only content available in that market is returned. If not provided, content is returned based on the user's account settings. \|
\| \`offset\` \| integer \| No \| The index of the first item to return (zero-based). Use with limit to paginate through results. Default is 0 (the first item). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get User's Top Artists

\*\*Slug:\*\* \`SPOTIFY\_GET\_USER\_S\_TOP\_ARTISTS\`

Get the current user's top artists based on calculated affinity. This endpoint retrieves the current user's top artists based on their listening history and calculated affinity. The affinity is computed over a specified time frame (short\_term, medium\_term, or long\_term). Required OAuth Scope: user-top-read Returns a paginated list of artist objects including their name, popularity, genres, images, and follower counts. Useful for understanding user preferences and music taste.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| The maximum number of items to return. Must be between 1 and 50. Default: 20. \|
\| \`offset\` \| integer \| No \| The index of the first item to return (for pagination). Default: 0 (the first item). Use with limit to get the next set of items. \|
\| \`time\_range\` \| string ("long\_term" \| "medium\_term" \| "short\_term") \| No \| Over what time frame the affinities are computed. long\_term (~1 year), medium\_term (~6 months), short\_term (~4 weeks). Default: medium\_term. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get User's Top Tracks

\*\*Slug:\*\* \`SPOTIFY\_GET\_USER\_S\_TOP\_TRACKS\`

Get the current user's top tracks based on calculated affinity. Returns the user's most-played tracks over different time periods based on their listening history and calculated affinity. Required OAuth Scope: user-top-read Note: The Spotify API limits results to the top 50 tracks per time range. Returns detailed track information including artist names, album details, popularity scores, duration, and preview URLs. Useful for understanding user listening preferences and music taste.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`limit\` \| integer \| No \| Maximum number of tracks to return. Minimum: 1, Maximum: 50. \|
\| \`offset\` \| integer \| No \| The index of the first track to return. Use with limit to paginate through results. Default: 0 (first track). \|
\| \`time\_range\` \| string \| No \| Time period for computing affinity. Options: 'long\_term' (calculated from ~1 year of data), 'medium\_term' (approximately last 6 months), 'short\_term' (approximately last 4 weeks). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Pause playback

\*\*Slug:\*\* \`SPOTIFY\_PAUSE\_PLAYBACK\`

Pause playback on the user's account. Pauses playback on the currently active device or on a specified device. Returns immediately with success when playback is paused. If no device is specified, the currently active device will be paused. Requirements: - Spotify Premium subscription - OAuth scope: user-modify-playback-state - Active playback session Note: The order of execution is not guaranteed when you use this API with other Player API endpoints. If playback is already paused, this action will still succeed (idempotent). Common scenarios: - Pause current playback: Call with no parameters - Pause specific device: Provide device\_id parameter Error scenarios: - 403: User does not have Spotify Premium - 404: No active device found

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`device\_id\` \| string \| No \| The ID of the device to pause playback on. If not provided, playback will be paused on the currently active device. Use the 'get\_available\_devices' action to retrieve device IDs. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Remove playlist items

\*\*Slug:\*\* \`SPOTIFY\_REMOVE\_PLAYLIST\_ITEMS\`

Remove one or more items from a user's playlist. This endpoint removes tracks or episodes from a playlist. You can remove items by URI (removes all occurrences) or by URI + positions (removes specific occurrences). Requires 'playlist-modify-public' scope for public playlists or 'playlist-modify-private' scope for private playlists.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`tracks\` \| array \| Yes \| An array of objects containing Spotify URIs of the tracks or episodes to remove. For example: \[{"uri": "spotify:track:4iV5W9uYEdYUVa79Axb7Rh"}, {"uri": "spotify:track:1301WleyT98MSxVHPZCA6M"}\]. A maximum of 100 objects can be sent at once. Optionally include "positions" to remove specific occurrences. \|
\| \`playlist\_id\` \| string \| Yes \| The Spotify ID of the playlist (e.g., '3cEYpjA9oz9GiPac4AsH4n'). \|
\| \`snapshot\_id\` \| string \| No \| The playlist's snapshot ID against which you want to make the changes. The API will validate that the specified items exist and in the specified positions and make the changes, even if more recent changes have been made to the playlist. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Remove users saved albums

\*\*Slug:\*\* \`SPOTIFY\_REMOVE\_USERS\_SAVED\_ALBUMS\`

Remove one or more albums from the current user's 'Your Music' library. This action removes albums from the user's saved albums collection in 'Your Library'. The operation is idempotent - removing an album that isn't saved will not cause an error. Required OAuth scope: user-library-modify

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ids\` \| string \| Yes \| A comma-separated list of Spotify album IDs (for query parameter, max 20 IDs) or a list of album IDs (for request body, max 50 IDs). Example (string): '382ObEPsp2rxGrnsizN5TX,1A2GTWGtFfWp7KSQTwWOyo,2noRn2Aes5aoNVsU6iWThc' Example (list): \['4iV5W9uYEdYUVa79Axb7Rh', '1301WleyT98MSxVHPZCA6M'\] \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Remove User's Saved Audiobooks

\*\*Slug:\*\* \`SPOTIFY\_REMOVE\_USER\_S\_SAVED\_AUDIOBOOKS\`

Remove one or more audiobooks from the current user's Spotify library. This endpoint removes saved audiobooks from the user's library. Audiobook IDs can be specified as a comma-separated string or as a list of IDs. Maximum of 50 IDs per request. Note: Audiobooks are only available in the US, UK, Canada, Ireland, New Zealand, and Australia markets. Required scope: user-library-modify

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ids\` \| string \| Yes \| A comma-separated list of the Spotify IDs for the audiobooks to remove. Maximum: 50 IDs. Audiobook IDs are 22-character base62 strings (e.g., '18yVqkdbdRvS24c0Ilj2ci,1HGw3J3NxZO1TP1BTtVhpZ'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Remove user's saved episodes

\*\*Slug:\*\* \`SPOTIFY\_REMOVE\_USER\_S\_SAVED\_EPISODES\`

Remove one or more episodes from the current user's library. This endpoint removes episodes that have been saved to the user's "Your Episodes" library. The operation is idempotent - removing an episode that is not saved will return success. Up to 50 episode IDs can be removed in a single request. Required scope: user-library-modify Note: This API endpoint is in beta and may change without notice.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ids\` \| string \| Yes \| A comma-separated list of Spotify episode IDs (e.g., '4iV5W9uYEdYUVa79Axb7Rh,1301WleyT98MSxVHPZCA6M') or a list of episode IDs (e.g., \['4iV5W9uYEdYUVa79Axb7Rh', '1301WleyT98MSxVHPZCA6M'\]). Maximum of 50 IDs per request. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Remove user s saved shows

\*\*Slug:\*\* \`SPOTIFY\_REMOVE\_USER\_S\_SAVED\_SHOWS\`

Delete one or more shows from current Spotify user's library.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ids\` \| string \| No \| A comma-separated list of Spotify show IDs to remove from the user's library. Maximum: 50 IDs per request. Example: '5CfCWKI5pZ28U0uOzXkDHe,5as3aKmN2k11yfDDDSrvaZ' \|
\| \`market\` \| string \| No \| An ISO 3166-1 alpha-2 country code (e.g., 'US', 'GB'). If provided, only shows available in that market will be considered. The user's account country takes priority if a valid access token is provided. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Remove user s saved tracks

\*\*Slug:\*\* \`SPOTIFY\_REMOVE\_USER\_S\_SAVED\_TRACKS\`

Remove one or more tracks from the current user's 'Your Music' library.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ids\` \| string \| No \| A comma-separated list of Spotify track IDs to remove from the user's library (e.g., '7ouMYWpwJ422jRcDASZB7P,4VqPOruhp5EdPBeR92t6lQ,2takcwOaAZWiXQijPHIx7B'). Maximum 50 IDs per request. Note: If this query parameter is provided, any IDs in the request body will be ignored. \|
\| \`body\_ids\` \| array \| No \| A JSON array of Spotify track IDs to remove from the user's library. For example: \["4iV5W9uYEdYUVa79Axb7Rh", "1301WleyT98MSxVHPZCA6M"\]. Maximum 50 items can be specified in one request. Note: If the 'ids' query parameter is present, this body parameter will be ignored. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Save albums for current user

\*\*Slug:\*\* \`SPOTIFY\_SAVE\_ALBUMS\_FOR\_CURRENT\_USER\`

Save one or more albums to the current user's 'Your Music' library. This action adds albums to the user's saved albums collection, which can be accessed later through 'Your Library'. The operation is idempotent - saving an album that is already saved will not cause an error. Required OAuth scope: user-library-modify

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ids\` \| string \| Yes \| A comma-separated list of Spotify album IDs (for query parameter, max 20 IDs) or a list of album IDs (for request body, max 50 IDs). Example (string): '4aawyAB9vmqN3uQ7FjRGTy,2up3OPMp9Tb4dAKM2erWXQ' Example (list): \['4iV5W9uYEdYUVa79Axb7Rh', '1301WleyT98MSxVHPZCA6M'\] \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Save audiobooks for current user

\*\*Slug:\*\* \`SPOTIFY\_SAVE\_AUDIOBOOKS\_FOR\_CURRENT\_USER\`

Save one or more audiobooks to the current user's library. This action adds audiobooks to the user's saved audiobooks collection, which can be accessed later through 'Your Library'. The operation is idempotent - saving an audiobook that is already saved will not cause an error. Required OAuth scope: user-library-modify

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ids\` \| string \| Yes \| A comma-separated list of Spotify audiobook IDs to save to the user's library. Maximum of 50 IDs. Example: '18yVqkdbdRvS24c0Ilj2ci,1HGw3J3NxZO1TP1BTtVhpZ,7iHfbu1YPACw6oZPAFJtqe' \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Save episodes for current user

\*\*Slug:\*\* \`SPOTIFY\_SAVE\_EPISODES\_FOR\_CURRENT\_USER\`

Save one or more podcast episodes to the current user's library. This endpoint saves episodes to the user's "Your Episodes" library, making them easily accessible for later playback. The operation is idempotent - saving an episode that is already saved will return success. Up to 50 episode IDs can be saved in a single request. Required scope: user-library-modify Note: This API endpoint is in beta and may change without notice.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ids\` \| array \| Yes \| A list of Spotify episode IDs to save to the current user's library. Maximum of 50 IDs can be specified in one request. Episode IDs are 22-character base62 strings (e.g., \['77o6BIVlYM3msb4MMIL1jH', '0Q86acNRm6V9GYx55SXKwf'\]). You can obtain episode IDs from the search endpoint, show episodes endpoint, or get several episodes endpoint. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Save shows for current user

\*\*Slug:\*\* \`SPOTIFY\_SAVE\_SHOWS\_FOR\_CURRENT\_USER\`

Save one or more shows to current Spotify user's library. Requires the user-library-modify scope. Maximum of 50 show IDs per request.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ids\` \| string \| Yes \| A comma-separated list of the Spotify IDs for the shows. Maximum: 50 IDs. Example: '5CfCWKI5pZ28U0uOzXkDHe,5as3aKmN2k11yfDDDSrvaZ' \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Save tracks for current user

\*\*Slug:\*\* \`SPOTIFY\_SAVE\_TRACKS\_FOR\_CURRENT\_USER\`

Save one or more tracks to the current user's 'Your Music' library. This action adds tracks to the user's saved tracks collection. You can provide either: - A simple list of track IDs (up to 50) - A list of timestamped IDs to preserve chronological order Requires the 'user-library-modify' OAuth scope.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ids\` \| array \| No \| A list of Spotify track IDs to save to the user's library. Maximum of 50 items. Example: \['4iV5W9uYEdYUVa79Axb7Rh', '1301WleyT98MSxVHPZCA6M'\]. Note: If 'timestamped\_ids' is provided, this field will be ignored. \|
\| \`timestamped\_ids\` \| array \| No \| A list of objects containing track IDs with their corresponding timestamps. Use this to specify when tracks were added to maintain chronological order. Maximum of 50 items. If provided, 'ids' field will be ignored. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Search for item

\*\*Slug:\*\* \`SPOTIFY\_SEARCH\_FOR\_ITEM\`

Get Spotify catalog information about albums, artists, playlists, tracks, shows, episodes or audiobooks that match a keyword string. Audiobooks are only available within the US, UK, Canada, Ireland, New Zealand and Australia markets.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`q\` \| string \| Yes \| Q \|
\| \`type\` \| array \| Yes \| Type \|
\| \`limit\` \| integer \| No \| Limit \|
\| \`market\` \| string \| No \| Market \|
\| \`offset\` \| integer \| No \| Offset \|
\| \`include\_external\` \| string ("audio") \| No \| Include External \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Seek to position

\*\*Slug:\*\* \`SPOTIFY\_SEEK\_TO\_POSITION\`

Seek to a specific position in the user's currently playing track. This action allows you to skip to any point in the currently playing track by specifying a position in milliseconds. For example, to skip to 1 minute into the track, use position\_ms=60000. \*\*Requirements:\*\* - Spotify Premium subscription required - User must have an active playback session with a track playing - Required OAuth scope: user-modify-playback-state \*\*Behavior:\*\* - Returns HTTP 204 No Content on success (no response body) - If position\_ms exceeds track duration, playback skips to the next track - If no device\_id is specified, targets the currently active device - Execution order is not guaranteed when used with other Player API endpoints \*\*Common Use Cases:\*\* - Skip to a specific timestamp in a podcast or long track - Resume playback from where a user left off - Implement custom seek controls in your application

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`device\_id\` \| string \| No \| The ID of the device to target for this command. If not supplied, the user's currently active device will be targeted. You can get device IDs from the get\_available\_devices action. \|
\| \`position\_ms\` \| integer \| Yes \| The position in milliseconds to seek to in the currently playing track. Must be a positive number (0 or greater). If you pass a position greater than the track's duration, playback will skip to the next track. Example: 30000 for 30 seconds, 60000 for 1 minute. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Set playback volume

\*\*Slug:\*\* \`SPOTIFY\_SET\_PLAYBACK\_VOLUME\`

Set the volume for the user's current playback device. This API only works for users who have Spotify Premium. The order of execution is not guaranteed when you use this API with other Player API endpoints.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`device\_id\` \| string \| No \| The ID of the device this command is targeting. If not supplied, the user's currently active device is the target. \|
\| \`volume\_percent\` \| integer \| Yes \| Volume percentage to set. Must be a value from 0 to 100 inclusive. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Set repeat mode

\*\*Slug:\*\* \`SPOTIFY\_SET\_REPEAT\_MODE\`

Set the repeat mode for the user's playback. Controls whether playback should repeat the current track, the current context (playlist, album, etc.), or not repeat at all. The change takes effect immediately on the user's active device. Requirements: - Spotify Premium subscription - OAuth scope: user-modify-playback-state - Active playback session Valid repeat modes: - "track": Repeat the current track continuously - "context": Repeat the current context (playlist/album/etc.) - "off": Turn repeat off Note: The order of execution is not guaranteed when you use this API with other Player API endpoints. This action is idempotent - setting the same repeat mode multiple times has the same effect as setting it once. Common scenarios: - Turn off repeat: {"state": "off"} - Repeat current track: {"state": "track"} - Repeat playlist/album: {"state": "context"} - Target specific device: {"state": "off", "device\_id": "abc123"} Error scenarios: - 403: User does not have Spotify Premium - 404: No active device found

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`state\` \| string ("track" \| "context" \| "off") \| Yes \| The repeat mode to set: track (repeat current track), context (repeat current context/playlist/album), or off (turn repeat off). \|
\| \`device\_id\` \| string \| No \| The ID of the device to target. If not provided, the user's currently active device will be targeted. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Skip to next

\*\*Slug:\*\* \`SPOTIFY\_SKIP\_TO\_NEXT\`

Skips to next track in the user's queue. This API only works for users who have Spotify Premium. The order of execution is not guaranteed when you use this API with other Player API endpoints.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`device\_id\` \| string \| No \| The ID of the device this command is targeting. If not supplied, the user's currently active device is the target. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Skip to previous

\*\*Slug:\*\* \`SPOTIFY\_SKIP\_TO\_PREVIOUS\`

Skips to the previous track in the user's queue. Requirements: - Spotify Premium subscription - Active playback (user must be currently playing music) - Requires 'user-modify-playback-state' scope Note: The order of execution is not guaranteed when you use this API with other Player API endpoints.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`device\_id\` \| string \| No \| The id of the device this command is targeting. If not supplied, the user's currently active device is the target. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Start resume playback

\*\*Slug:\*\* \`SPOTIFY\_START\_RESUME\_PLAYBACK\`

Start a new context or resume current playback on the user's active device. Starts playback of a specific context (album, artist, or playlist), a list of tracks, or resumes currently paused playback. Returns immediately with success when playback starts. Requirements: - Spotify Premium subscription - OAuth scope: user-modify-playback-state - At least one active Spotify device (mobile, desktop, web player, or smart speaker) Usage patterns: - Resume paused playback: Call with no parameters - Play an album/playlist: Use 'context\_uri' parameter - Play specific tracks: Use 'uris' parameter - Play from a specific track in a context: Use 'context\_uri' with 'offset' - Start from a specific position in a track: Use 'position\_ms' Note: The order of execution is not guaranteed when you use this API with other Player API endpoints. You cannot use both 'context\_uri' and 'uris' parameters together. Common error scenarios: - 403: User does not have Spotify Premium - 404: No active device found

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`uris\` \| array \| No \| List of Spotify track URIs to play. Example: \['spotify:track:4iV5W9uYEdYUVa79Axb7Rh', 'spotify:track:1301WleyT98MSxVHPZCA6M'\]. Cannot be used with 'context\_uri' parameter. \|
\| \`offset\` \| object \| No \| Starting position in the context. Only available when 'context\_uri' is an album or playlist. Use either 'position' (zero-based track index) or 'uri' (specific track URI). Example with position: {'position': 5}. Example with URI: {'uri': 'spotify:track:1301WleyT98MSxVHPZCA6M'}. \|
\| \`device\_id\` \| string \| No \| The ID of the device to target for playback. If not provided, playback will start/resume on the currently active device. Use the 'get\_available\_devices' action to retrieve device IDs. \|
\| \`context\_uri\` \| string \| No \| Spotify URI of the context to play. Valid contexts are albums, artists, or playlists. Example: 'spotify:album:1Je1IMUlBXcx1Fz0WE7oPT' or 'spotify:playlist:37i9dQZF1DXcBWIGoYBM5M'. Cannot be used with 'uris' parameter. \|
\| \`position\_ms\` \| integer \| No \| Position in milliseconds to start playback. Must be a positive number. If greater than the track length, the player will skip to the next song. Example: 25000 (starts 25 seconds into the track). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Toggle playback shuffle

\*\*Slug:\*\* \`SPOTIFY\_TOGGLE\_PLAYBACK\_SHUFFLE\`

Toggle shuffle on or off for user's playback. This API only works for users who have Spotify Premium. The order of execution is not guaranteed when you use this API with other Player API endpoints. Required OAuth scope: user-modify-playback-state Note: This endpoint returns 204 No Content on success, 404 if no active device is found, and 403 if the user does not have an active Spotify Premium subscription.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`state\` \| boolean \| Yes \| true: Enable shuffle for user's playback. false: Disable shuffle for user's playback. \|
\| \`device\_id\` \| string \| No \| The ID of the device to target for playback control. If not provided, the command will target the user's currently active device. Device IDs can be retrieved from the Get Available Devices endpoint. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Transfer playback

\*\*Slug:\*\* \`SPOTIFY\_TRANSFER\_PLAYBACK\`

Transfer playback to a new device and optionally begin playback. Requirements: - Spotify Premium subscription is required - Target device must be active and available (use Get Available Devices to retrieve device IDs) - Requires user-modify-playback-state scope Note: The order of execution is not guaranteed when you use this API with other Player API endpoints. Returns 204 No Content on success, 403 Forbidden if user doesn't have Premium.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`play\` \| boolean \| No \| Whether to start playback on the new device. If true, playback will start on the new device. If false or not provided, the current playback state is maintained. \|
\| \`device\_ids\` \| array \| Yes \| List containing the device ID to transfer playback to. Note: Only a single device\_id is currently supported by Spotify API. Obtain device IDs using the get\_available\_devices action. Example: \['74ASZWbe4lXaubB36ztrGX'\] \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Unfollow artists or users

\*\*Slug:\*\* \`SPOTIFY\_UNFOLLOW\_ARTISTS\_OR\_USERS\`

Remove the current user as a follower of one or more artists or other Spotify users. This action removes the specified artists or users from the current user's "Following" list, stopping their content from appearing in the user's personalized feed. The operation is idempotent - attempting to unfollow an already-unfollowed artist/user will succeed without error. Required OAuth scope: user-follow-modify Common use cases: - Unfollow an artist you no longer want to track - Unfollow multiple artists at once (up to 50) - Unfollow other Spotify users to stop seeing their public playlists and activity - Clean up your following list by removing inactive or irrelevant accounts Note: Artist IDs can be obtained from search results, track objects, or album objects. User IDs can be obtained from user profile endpoints or playlist owner information.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`ids\` \| string \| Yes \| A comma-separated list of Spotify IDs for the artists or users to unfollow. For example: '2CIMQHirSU0MQqyYHq0eOx,57dN52uHvrHOxijzpIgu3E'. A maximum of 50 IDs can be sent in one request. \|
\| \`type\` \| string ("artist" \| "user") \| Yes \| The type of Spotify entity to unfollow. Use 'artist' to unfollow musical artists/bands, or 'user' to unfollow other Spotify users. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Unfollow playlist

\*\*Slug:\*\* \`SPOTIFY\_UNFOLLOW\_PLAYLIST\`

Remove the current user as a follower of a playlist. This action removes the current user from following a playlist. The user no longer receives updates from the playlist and it is removed from their followed playlists list. This operation is idempotent - if the user is not currently following the playlist, the operation will still succeed. Required OAuth scopes: - playlist-modify-public: For unfollowing public playlists - playlist-modify-private: For unfollowing private playlists Note: Even if you are the playlist's owner, unfollowing removes it from your library. There is no separate "delete" endpoint - unfollowing is the equivalent operation.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`playlist\_id\` \| string \| Yes \| The Spotify ID of the playlist to unfollow. This is a 22-character base62 string that uniquely identifies the playlist (e.g., '37i9dQZF1DXcBWIGoYBM5M'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update playlist items

\*\*Slug:\*\* \`SPOTIFY\_UPDATE\_PLAYLIST\_ITEMS\`

Either replace all tracks in a playlist OR reorder existing tracks within it. \*\*REPLACE mode\*\*: Use \`uris\` parameter to completely overwrite all tracks in the playlist. Example: Replace all tracks with 3 specific tracks. \*\*REORDER mode\*\*: Use \`range\_start\`, \`insert\_before\`, and optionally \`range\_length\`/\`snapshot\_id\` to move tracks within the playlist without adding/removing any. Example: Move tracks at positions 5-7 to the beginning of the playlist. These two modes are mutually exclusive - you cannot use both in the same request.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`uris\` \| string \| No \| \*\*\[REPLACE MODE\]\*\* Spotify URIs of tracks or episodes to replace the entire playlist with. Accepts either: - Comma-separated string: 'spotify:track:4iV5W9uYEdYUVa79Axb7Rh,spotify:track:1301WleyT98MSxVHPZCA6M' - List of strings: \['spotify:track:4iV5W9uYEdYUVa79Axb7Rh', 'spotify:track:1301WleyT98MSxVHPZCA6M'\] Maximum 100 items per request. This will overwrite ALL existing tracks in the playlist. \*\*NOTE\*\*: Cannot be used with reorder parameters (range\_start, insert\_before, range\_length). \|
\| \`playlist\_id\` \| string \| Yes \| The Spotify ID of the playlist (e.g., '3cEYpjA9oz9GiPac4AsH4n'). Can be found in the playlist URL or obtained from playlist creation/search endpoints. \|
\| \`range\_start\` \| integer \| No \| \*\*\[REORDER MODE\]\*\* Zero-based index of the first track to be reordered. Example: range\_start=0 means start from the first track. \*\*NOTE\*\*: Cannot be used with \`uris\` parameter. \|
\| \`snapshot\_id\` \| string \| No \| \*\*\[REORDER MODE\]\*\* The playlist's snapshot ID to validate against before making changes. Can be obtained from playlist get/create/update responses and used to identify the playlist version to target. \*\*NOTE\*\*: Cannot be used with \`uris\` parameter. \|
\| \`range\_length\` \| integer \| No \| \*\*\[REORDER MODE\]\*\* Number of consecutive tracks to reorder starting from \`range\_start\`. Defaults to 1 if not specified. Example: range\_length=2 means move 2 tracks. \*\*NOTE\*\*: Cannot be used with \`uris\` parameter. \|
\| \`insert\_before\` \| integer \| No \| \*\*\[REORDER MODE\]\*\* Zero-based position where the tracks should be moved to. Examples: - To move first track to end (10 tracks): range\_start=0, insert\_before=10 - To move last track to start (10 tracks): range\_start=9, insert\_before=0 - To move tracks at positions 9-10 to start: range\_start=9, insert\_before=0, range\_length=2 \*\*NOTE\*\*: Cannot be used with \`uris\` parameter. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\## Triggers

\### New Device Added

\*\*Slug:\*\* \`SPOTIFY\_NEW\_DEVICE\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when a new device is added.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`device\` \| object \| Yes \| Device details \|
\| \`event\_type\` \| string \| Yes \| Type of device event (added/removed) \|

\### Spotify Playlist Item Change

\*\*Slug:\*\* \`SPOTIFY\_PLAYLIST\_ITEM\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when songs are added to or removed from a Spotify playlist.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|
\| \`playlist\_id\` \| string \| Yes \| The ID of the Spotify playlist \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`event\_type\` \| string \| Yes \| Type of playlist item event (added/removed) \|
\| \`track\` \| object \| Yes \| Track details \|

\### New Playlist Created or Deleted

\*\*Slug:\*\* \`SPOTIFY\_PLAYLIST\_TRIGGER\`

\*\*Type:\*\* poll

Triggers when a new playlist is created or deleted.

\#### Configuration

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`interval\` \| number \| No \| Periodic Interval to Check for Updates & Send a Trigger in Minutes \|

\#### Payload

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`event\_type\` \| string \| Yes \| Type of playlist event (created/deleted) \|
\| \`playlist\` \| object \| Yes \| Playlist details \|
