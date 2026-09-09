---
url: https://docs.composio.dev/toolkits/hugging_face.md
title: https://docs.composio.dev/toolkits/hugging_face.md
description: 
status: 200
---

\# Hugging Face

Build, train and deploy state of the art models powered by the reference open source in machine learning.

\- \*\*Category:\*\* artificial intelligence
\- \*\*Auth:\*\* API\_KEY, OAUTH2
\- \*\*Composio-managed OAuth available?\*\* Yes
\- \*\*Tools:\*\* 135
\- \*\*Triggers:\*\* 0
\- \*\*Slug:\*\* \`HUGGING\_FACE\`
\- \*\*Version:\*\* 20260729\_00

\## Tools

\### Change Discussion Status

\*\*Slug:\*\* \`HUGGING\_FACE\_CHANGE\_DISCUSSIONS\_STATUS\`

Tool to change the status of a Hugging Face repository discussion. Use when you need to open or close discussions on models, datasets, or spaces.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`num\` \| string \| Yes \| The discussion number or ID to change the status of. This is the numeric identifier of the discussion thread. \|
\| \`repo\` \| string \| Yes \| The repository name where the discussion exists. For example, 'bert-base-uncased' or 'my-dataset'. \|
\| \`status\` \| string ("open" \| "closed") \| Yes \| The new status to set for the discussion. Use 'open' to reopen a closed discussion or 'closed' to close an open discussion. \|
\| \`comment\` \| string \| No \| Optional comment to add when changing the status. Useful for explaining why the discussion is being closed or reopened. \|
\| \`namespace\` \| string \| Yes \| The namespace (username or organization) that owns the repository. For example, 'google-bert' or 'huggingface'. \|
\| \`repo\_type\` \| string ("models" \| "spaces" \| "datasets") \| Yes \| The type of repository where the discussion exists. Must be one of: models, spaces, or datasets. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Check Dataset Validity

\*\*Slug:\*\* \`HUGGING\_FACE\_CHECK\_DATASET\_VALIDITY\`

Tool to check whether a specific dataset is valid on Hugging Face Hub. Use when you need to determine what features (preview, viewer, search, filter, statistics) are available for a dataset.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`dataset\` \| string \| Yes \| Name of the dataset to check validity for. Format: 'namespace/repo-name' (e.g., 'rajpurkar/squad', 'huggingface/cifar10'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Check Models Upload Method

\*\*Slug:\*\* \`HUGGING\_FACE\_CHECK\_MODELS\_UPLOAD\_METHOD\`

Tool to check if files should be uploaded through the Large File mechanism or directly. Use when preparing to upload files to a Hugging Face model repository to determine the appropriate upload method for each file.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rev\` \| string \| Yes \| The git revision (branch, tag, or commit hash) to upload to. \|
\| \`repo\` \| string \| Yes \| The name of the model repository. \|
\| \`files\` \| array \| Yes \| List of files to check for upload method. Maximum 1000 files. \|
\| \`gitIgnore\` \| string \| No \| Content of the .gitignore file for the revision. Optional, otherwise uses existing .gitignore content. \|
\| \`namespace\` \| string \| Yes \| The namespace (user or organization) that owns the model repository. \|
\| \`gitAttributes\` \| string \| No \| Content of the .gitattributes file. Provide this if you plan to modify .gitattributes yourself when uploading LFS files. Not needed if relying on automatic LFS detection. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Check Spaces Upload Method

\*\*Slug:\*\* \`HUGGING\_FACE\_CHECK\_SPACES\_UPLOAD\_METHOD\`

Tool to check if files should be uploaded through the Large File mechanism or directly to Hugging Face Spaces. Use when preparing to upload files to a Hugging Face Space repository to determine the appropriate upload method for each file.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rev\` \| string \| Yes \| The git revision (branch, tag, or commit hash) to upload to. \|
\| \`repo\` \| string \| Yes \| The name of the Space repository. \|
\| \`files\` \| array \| Yes \| List of files to check for upload method. Maximum 1000 files. \|
\| \`gitIgnore\` \| string \| No \| Content of the .gitignore file for the revision. Optional, otherwise uses existing .gitignore content. \|
\| \`namespace\` \| string \| Yes \| The namespace (user or organization) that owns the Space repository. \|
\| \`gitAttributes\` \| string \| No \| Content of the .gitattributes file. Provide this if you plan to modify .gitattributes yourself when uploading LFS files. Not needed if relying on automatic LFS detection. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Claim Paper Authorship

\*\*Slug:\*\* \`HUGGING\_FACE\_CLAIM\_SETTINGS\_PAPERS\_CLAIM\`

Tool to claim authorship of a paper on Hugging Face. Use when you need to associate yourself or another user with an ArXiv paper.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`paper\_id\` \| string \| Yes \| ArXiv paper identifier being claimed. This should be the ArXiv ID of the paper you want to claim authorship for. \|
\| \`target\_user\_id\` \| string \| No \| HF user who should receive the claim. Must be a 24-character hexadecimal string representing the Hugging Face user ID. Only provide this if you need to assign the claim to a specific user. \|
\| \`claim\_author\_id\` \| string \| No \| Author entry on the paper being claimed. Must be a 24-character hexadecimal string representing the specific author entry on the paper. Only provide this if you need to specify a particular author entry. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Request Repository Access

\*\*Slug:\*\* \`HUGGING\_FACE\_CREATE\_ASK\_ACCESS\`

Tool to request access to a gated repository on Hugging Face Hub. Use when you need to submit an access request for models, datasets, or Spaces that require approval. The fields required vary by repository.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`repo\` \| string \| Yes \| The repository name of the gated model, dataset, or Space. \|
\| \`namespace\` \| string \| Yes \| The namespace (organization or user) that owns the gated repository. \|
\| \`repo\_type\` \| string ("models" \| "datasets" \| "spaces") \| No \| The type of repository (models, datasets, or spaces). Defaults to models. \|
\| \`access\_request\_fields\` \| object \| Yes \| A dictionary of field names and values required by the repository's access form. Common fields include "First Name", "Last Name", "Date of birth" (YYYY-MM-DD format), "Country" (country code), "Affiliation", "Job title", and terms acceptance fields. The exact fields vary by repository and are specified in the repository's gated access configuration. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Collection

\*\*Slug:\*\* \`HUGGING\_FACE\_CREATE\_COLLECTION\`

Tool to create a new collection on Hugging Face. Use when you need to organize and curate models, datasets, spaces, papers, or other collections into a named collection.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`item\` \| object \| No \| Item to be added to the collection upon creation. \|
\| \`title\` \| string \| Yes \| The title of the collection. Must be between 1 and 60 characters. \|
\| \`private\` \| boolean \| No \| If not provided, the collection will be public. This field will respect the organization's visibility setting. \|
\| \`namespace\` \| string \| Yes \| The namespace (username or organization) under which to create the collection \|
\| \`description\` \| string \| No \| Optional description for the collection. Maximum 150 characters. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Datasets Branch

\*\*Slug:\*\* \`HUGGING\_FACE\_CREATE\_DATASETS\_BRANCH\`

Tool to create a new branch in a Hugging Face dataset repository. Use when you need to create a branch for versioning or experimentation with dataset changes.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rev\` \| string \| Yes \| The name of the new branch to create. \|
\| \`repo\` \| string \| Yes \| The name of the dataset repository without the namespace prefix. \|
\| \`namespace\` \| string \| Yes \| The namespace (username or organization) that owns the dataset repository. \|
\| \`overwrite\` \| boolean \| No \| Overwrite the branch if it already exists. Defaults to false. \|
\| \`emptyBranch\` \| boolean \| No \| Create an empty branch without any files. Defaults to false. \|
\| \`startingPoint\` \| string \| No \| The commit hash, tag, or branch name to start the new branch from. Defaults to 'main' if not specified. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Datasets Commit

\*\*Slug:\*\* \`HUGGING\_FACE\_CREATE\_DATASETS\_COMMIT\`

Tool to create a commit in a Hugging Face dataset repository. Use when you need to add, update, or delete files in a dataset. Supports both regular files and Large File Storage (LFS) for large binary files. Can optionally create a pull request instead of directly committing.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rev\` \| string \| Yes \| Revision (branch name, tag, or commit SHA) to commit to \|
\| \`repo\` \| string \| Yes \| Name of the dataset repository \|
\| \`files\` \| array \| No \| List of files to add or update in the commit. Each file requires a path and either content or oldPath. \|
\| \`summary\` \| string \| Yes \| Summary of the commit (required). This is the commit message title. \|
\| \`create\_pr\` \| string \| No \| Whether to create a pull request from the commit. Set to '1' or 'true' to create a PR. \|
\| \`lfs\_files\` \| array \| No \| List of Large File Storage (LFS) files to include in the commit \|
\| \`namespace\` \| string \| Yes \| Namespace (username or organization) that owns the dataset repository \|
\| \`hot\_reload\` \| string \| No \| For Spaces, whether to try to hot reload the commit (only for single Python file updates). Set to '1' or 'true' to enable. \|
\| \`description\` \| string \| No \| Detailed description of the commit (optional). Defaults to empty string. \|
\| \`parent\_commit\` \| string \| No \| Parent commit SHA (40-character hexadecimal string). Optional, defaults to HEAD of the revision. \|
\| \`deleted\_entries\` \| array \| No \| List of files to delete from the repository \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Check Dataset File Upload Method

\*\*Slug:\*\* \`HUGGING\_FACE\_CREATE\_DATASETS\_PREUPLOAD\`

Tool to check if files should be uploaded via Large File Storage (LFS) or directly to a Hugging Face dataset repository. Use before uploading files to determine the correct upload method for each file based on size and repository settings.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rev\` \| string \| Yes \| Revision (branch or commit) to check preupload for. Typically 'main' for the default branch \|
\| \`repo\` \| string \| Yes \| Name of the dataset repository \|
\| \`files\` \| array \| Yes \| List of files to check for upload method. Maximum 1000 files per request \|
\| \`gitIgnore\` \| string \| No \| Content of .gitignore file for the revision. Optional; uses existing .gitignore if not provided \|
\| \`namespace\` \| string \| Yes \| Namespace (username or organization) that owns the dataset repository \|
\| \`gitAttributes\` \| string \| No \| Content of .gitattributes file if you plan to modify it yourself. Only needed if managing LFS tracking manually; otherwise HF automatically updates .gitattributes \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Datasets Tag

\*\*Slug:\*\* \`HUGGING\_FACE\_CREATE\_DATASETS\_TAG\`

Tool to create a tag on a Hugging Face dataset repository. Use when you need to mark a specific revision with a named tag.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rev\` \| string \| Yes \| The revision (branch or commit SHA) to create the tag from, typically 'main'. \|
\| \`tag\` \| string \| Yes \| The name of the tag to create (e.g., 'v1.0', 'release-2024'). \|
\| \`repo\` \| string \| Yes \| The name of the dataset repository to create a tag for. \|
\| \`message\` \| string \| No \| Optional message describing the purpose of this tag. \|
\| \`namespace\` \| string \| Yes \| The namespace (username or organization) that owns the dataset. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Discussion

\*\*Slug:\*\* \`HUGGING\_FACE\_CREATE\_DISCUSSIONS\`

Tool to create a new discussion on a Hugging Face repository (model, dataset, or Space). Use when you need to start a conversation, report an issue, or create a pull request discussion.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`repo\` \| string \| Yes \| The name of the repository where the discussion will be created. \|
\| \`title\` \| string \| Yes \| The title of the discussion. Must be between 3 and 200 characters. \|
\| \`namespace\` \| string \| Yes \| The namespace (username or organization) that owns the repository. \|
\| \`repo\_type\` \| string ("models" \| "spaces" \| "datasets") \| Yes \| The type of repository: models, spaces, or datasets. This determines where the discussion will be created. \|
\| \`description\` \| string \| Yes \| The description/content of the discussion. Can contain markdown formatting. Maximum 65536 characters. \|
\| \`pull\_request\` \| boolean \| No \| Whether this discussion should be created as a pull request. If true, creates a PR instead of a regular discussion. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Discussion Comment

\*\*Slug:\*\* \`HUGGING\_FACE\_CREATE\_DISCUSSIONS\_COMMENT\`

Tool to create a new comment on a Hugging Face repository discussion. Use when you need to add comments or replies to discussions on models, datasets, or spaces.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`num\` \| string \| Yes \| The discussion number or ID to comment on. This is the numeric identifier of the discussion thread. \|
\| \`repo\` \| string \| Yes \| The repository name where the discussion exists. For example, 'gpt2' or 'my-dataset'. \|
\| \`comment\` \| string \| Yes \| The comment text to post on the discussion. Must be between 1 and 65536 characters. \|
\| \`namespace\` \| string \| Yes \| The namespace (username or organization) that owns the repository. For example, 'openai-community' or 'huggingface'. \|
\| \`repo\_type\` \| string ("models" \| "spaces" \| "datasets") \| Yes \| The type of repository where the discussion exists. Must be one of: models, spaces, or datasets. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Pin discussion

\*\*Slug:\*\* \`HUGGING\_FACE\_CREATE\_DISCUSSIONS\_PIN\`

Tool to pin or unpin a discussion on a Hugging Face repository (model, dataset, or Space). Use when you need to highlight important discussions by pinning them to the top of the list, or unpin them when they're no longer priority.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`num\` \| string \| Yes \| The discussion number/identifier to pin or unpin. This is the numeric ID shown in the discussion URL. \|
\| \`repo\` \| string \| Yes \| The name of the repository containing the discussion. For example, for 'meta-llama/Llama-2-7b', the repo is 'Llama-2-7b'. \|
\| \`pinned\` \| boolean \| Yes \| Whether to pin (true) or unpin (false) the discussion. Pinned discussions appear at the top of the discussions list. \|
\| \`namespace\` \| string \| Yes \| The namespace (username or organization) that owns the repository. For example, for 'meta-llama/Llama-2-7b', the namespace is 'meta-llama'. \|
\| \`repo\_type\` \| string ("models" \| "spaces" \| "datasets") \| Yes \| The type of repository: models, spaces, or datasets. This determines which repository type contains the discussion. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create models branch

\*\*Slug:\*\* \`HUGGING\_FACE\_CREATE\_MODELS\_BRANCH\`

Tool to create a new branch in a Hugging Face model repository. Use when you need to create a branch for experimenting with model changes, versioning, or creating isolated development environments.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rev\` \| string \| Yes \| The name for the new branch to be created (e.g., 'feature-branch', 'experiment-v2'). This will be the branch name in the repository. \|
\| \`repo\` \| string \| Yes \| The name of the model repository where the branch will be created. For example, for model 'meta-llama/Llama-2-7b', the repo is 'Llama-2-7b'. \|
\| \`namespace\` \| string \| Yes \| The namespace (username or organization) that owns the model repository. For example, for model 'meta-llama/Llama-2-7b', the namespace is 'meta-llama'. \|
\| \`overwrite\` \| boolean \| No \| Overwrite the branch if it already exists. If False (default), creating a branch that already exists will result in an error. \|
\| \`empty\_branch\` \| boolean \| No \| Create an empty branch without any files. If True, startingPoint is not required. If False (default), startingPoint should be provided. \|
\| \`starting\_point\` \| string \| No \| The commit hash or branch name to start the new branch from (e.g., 'main', 'dev', or a commit hash). Required unless creating an empty branch. Defaults to 'main' if not specified and emptyBranch is False. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Models Commit

\*\*Slug:\*\* \`HUGGING\_FACE\_CREATE\_MODELS\_COMMIT\`

Tool to create a commit to a Hugging Face model repository. Use when you need to add, update, or delete files in a model repository. Supports both standard JSON and JSON-lines (NDJSON) formats. JSON-lines format is recommended for better performance.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rev\` \| string \| Yes \| The git revision (branch, tag, or commit SHA) to commit to \|
\| \`repo\` \| string \| Yes \| The name of the model repository to commit to \|
\| \`files\` \| array \| No \| List of files to add or update in the commit \|
\| \`summary\` \| string \| Yes \| Summary message for the commit. This is a required field that describes the commit \|
\| \`create\_pr\` \| string \| No \| Whether to create a pull request from the commit. Typically '1' or 'true' to create a PR \|
\| \`lfs\_files\` \| array \| No \| List of LFS (Large File Storage) files to add or update \|
\| \`namespace\` \| string \| Yes \| The namespace (user or organization) that owns the model repository \|
\| \`hot\_reload\` \| string \| No \| For Spaces, whether to try to hot reload the commit (only for single python files updates). Typically '1' or 'true' to enable hot reload \|
\| \`description\` \| string \| No \| Optional detailed description for the commit. Defaults to empty string if not provided \|
\| \`content\_type\` \| string ("application/json" \| "application/x-ndjson") \| No \| Content type for the request. Use application/x-ndjson (recommended) for JSON-lines format or application/json for standard JSON \|
\| \`parent\_commit\` \| string \| No \| Optional parent commit SHA (40-character hex string). If provided, the commit will be based on this specific commit \|
\| \`deleted\_entries\` \| array \| No \| List of files to delete from the repository \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Models Tag

\*\*Slug:\*\* \`HUGGING\_FACE\_CREATE\_MODELS\_TAG\`

Tool to create a tag on a Hugging Face model repository. Use when you need to mark a specific revision with a named tag.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rev\` \| string \| Yes \| The revision (branch or commit SHA) to create the tag from, typically 'main'. \|
\| \`tag\` \| string \| Yes \| The name of the tag to create (e.g., 'v1.0', 'release-2024'). \|
\| \`repo\` \| string \| Yes \| The name of the model repository to create a tag for. \|
\| \`message\` \| string \| No \| Optional message describing the purpose of this tag. \|
\| \`namespace\` \| string \| Yes \| The namespace (username or organization) that owns the model. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Paper Comment

\*\*Slug:\*\* \`HUGGING\_FACE\_CREATE\_PAPERS\_COMMENT\`

Tool to create a new comment on a Hugging Face paper. Use when you need to add comments or feedback to research papers on Hugging Face.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`comment\` \| string \| Yes \| The comment text to post on the paper. Must be between 1 and 65536 characters. \|
\| \`paper\_id\` \| string \| Yes \| The unique identifier of the paper to comment on. This can be the paper ID (e.g., '2408.04619') or the full paper path. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Papers Comment Reply

\*\*Slug:\*\* \`HUGGING\_FACE\_CREATE\_PAPERS\_COMMENT\_REPLY\`

Tool to create a reply to a comment on a Hugging Face paper. Use when you need to respond to an existing comment on a paper discussion.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`comment\` \| string \| Yes \| The content of the reply comment. \|
\| \`paper\_id\` \| string \| Yes \| The unique identifier of the paper (e.g., '2312.09323'). \|
\| \`comment\_id\` \| string \| Yes \| The unique identifier of the comment to reply to (e.g., '65844ff1ee15e3c7fc034c97'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Papers Index

\*\*Slug:\*\* \`HUGGING\_FACE\_CREATE\_PAPERS\_INDEX\`

Tool to index a paper from arXiv by its ID on Hugging Face. Use when you need to make a paper searchable and accessible on the platform. Note: If the paper is already indexed, only its authors can re-index it.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`arxiv\_id\` \| string \| Yes \| The arXiv ID of the paper to index (format: YYMM.NNNNN or YYMM.NNNN, e.g., '2411.19876' or '1234.5678'). Only the paper's authors can re-index if already indexed. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Repository

\*\*Slug:\*\* \`HUGGING\_FACE\_CREATE\_REPO\`

Tool to create a new repository (model, dataset, or Space) on Hugging Face Hub. Use when you need to initialize a new repository for uploading models, datasets, or deploying Spaces applications.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`sdk\` \| string ("gradio" \| "streamlit" \| "docker" \| "static") \| No \| SDK options for Spaces. \|
\| \`name\` \| string \| Yes \| The name of the repository to create. This will be the repository identifier within the namespace. \|
\| \`type\` \| string ("model" \| "dataset" \| "space") \| No \| The type of repository to create: model, dataset, or space. Defaults to 'model' if not specified. \|
\| \`private\` \| boolean \| No \| Whether the repository should be private. If not specified, follows the default visibility setting for your account or organization. \|
\| \`organization\` \| string \| No \| The organization namespace to create the repository under. If not provided, the repository will be created under your personal namespace. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create spaces branch

\*\*Slug:\*\* \`HUGGING\_FACE\_CREATE\_SPACES\_BRANCH\`

Tool to create a new branch in a Hugging Face space repository. Use when you need to create a branch for experimenting with space changes, versioning, or creating isolated development environments.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rev\` \| string \| Yes \| The name for the new branch to be created (e.g., 'feature-branch', 'experiment-v2'). This will be the branch name in the repository. \|
\| \`repo\` \| string \| Yes \| The name of the space repository where the branch will be created. For example, for space 'huggingface/my-space', the repo is 'my-space'. \|
\| \`namespace\` \| string \| Yes \| The namespace (username or organization) that owns the space repository. For example, for space 'huggingface/my-space', the namespace is 'huggingface'. \|
\| \`overwrite\` \| boolean \| No \| Overwrite the branch if it already exists. If False (default), creating a branch that already exists will result in an error. \|
\| \`empty\_branch\` \| boolean \| No \| Create an empty branch without any files. If True, startingPoint is not required. If False (default), startingPoint should be provided. \|
\| \`starting\_point\` \| string \| No \| The commit hash or branch name to start the new branch from (e.g., 'main', 'dev', or a commit hash). Required unless creating an empty branch. Defaults to 'main' if not specified and emptyBranch is False. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Spaces Commit

\*\*Slug:\*\* \`HUGGING\_FACE\_CREATE\_SPACES\_COMMIT\`

Tool to create a commit in a Hugging Face Space repository. Use when you need to add, update, or delete files in a Space. Supports both JSON and NDJSON (recommended) payload formats for commits.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rev\` \| string \| Yes \| The revision (branch or commit) to commit to. Typically 'main' for the default branch \|
\| \`repo\` \| string \| Yes \| The name of the Space repository where the commit will be created. For example, for Space 'user/my-space', the repo is 'my-space' \|
\| \`files\` \| array \| No \| List of files to add or update in the commit. For JSON payload format only \|
\| \`summary\` \| string \| Yes \| Summary of the commit (required). This is the commit message title \|
\| \`createPr\` \| string \| No \| Whether to create a pull request from the commit instead of committing directly. Set to 'true' to create a PR, 'false' or omit to commit directly \|
\| \`lfsFiles\` \| array \| No \| List of Large File Storage (LFS) files to add or update. For JSON payload format only \|
\| \`hotReload\` \| string \| No \| For Spaces, whether to try to hot reload the commit (only works for single Python file updates). Set to 'true' to enable hot reload \|
\| \`namespace\` \| string \| Yes \| The namespace (username or organization) that owns the Space. For example, for Space 'user/my-space', the namespace is 'user' \|
\| \`contentType\` \| string ("application/json" \| "application/x-ndjson") \| No \| Content type for the commit request. \|
\| \`description\` \| string \| No \| Detailed description of the commit (optional, defaults to empty string). This is the commit message body \|
\| \`parentCommit\` \| string \| No \| The parent commit SHA (40-character hexadecimal). Optional, defaults to current HEAD of the branch \|
\| \`deletedEntries\` \| array \| No \| List of file paths to delete in the commit. For JSON payload format only \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create or update Space secret

\*\*Slug:\*\* \`HUGGING\_FACE\_CREATE\_SPACES\_SECRETS\`

Tool to create or update a secret in a Hugging Face Space. Use when you need to add or update environment variables or sensitive configuration values for a Space. This action upserts the secret, meaning it will create a new secret if it doesn't exist or update it if it already exists.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`key\` \| string \| Yes \| The name of the secret key. Must start with a letter and contain only letters, digits, and underscores (pattern: ^\[a-zA-Z\]\[\_a-zA-Z0-9\]\*$). For example: 'API\_KEY', 'DATABASE\_URL', 'TEST\_SECRET\_KEY'. \|
\| \`repo\` \| string \| Yes \| The name of the Space repository where the secret will be created or updated. For example, for Space 'huggingface/my-space', the repo is 'my-space'. \|
\| \`value\` \| string \| No \| The value of the secret. This will be stored securely and not visible after creation. Defaults to empty string if not provided. \|
\| \`namespace\` \| string \| Yes \| The namespace (username or organization) that owns the Space. For example, for Space 'huggingface/my-space', the namespace is 'huggingface'. \|
\| \`description\` \| string \| No \| Optional description of the secret to help identify its purpose. For example: 'API key for external service', 'Database connection string'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Spaces Tag

\*\*Slug:\*\* \`HUGGING\_FACE\_CREATE\_SPACES\_TAG\`

Tool to create a tag on a Hugging Face space repository. Use when you need to mark a specific revision with a named tag.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rev\` \| string \| Yes \| The revision (branch or commit SHA) to create the tag from, typically 'main'. \|
\| \`tag\` \| string \| Yes \| The name of the tag to create (e.g., 'v1.0', 'release-2024'). \|
\| \`repo\` \| string \| Yes \| The name of the space repository to create a tag for. \|
\| \`message\` \| string \| No \| Optional message describing the purpose of this tag. \|
\| \`namespace\` \| string \| Yes \| The namespace (username or organization) that owns the space. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create or update Space variable

\*\*Slug:\*\* \`HUGGING\_FACE\_CREATE\_SPACES\_VARIABLES\`

Tool to create or update a variable in a Hugging Face Space. Use when you need to add or update environment variables or configuration values for a Space. This action upserts the variable, meaning it will create a new variable if it doesn't exist or update it if it already exists.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`key\` \| string \| Yes \| The name of the variable key. Must start with a letter and contain only letters, digits, and underscores (pattern: ^\[a-zA-Z\]\[\_a-zA-Z0-9\]\*$). For example: 'APP\_MODE', 'DEBUG\_ENABLED', 'TEST\_VAR\_123'. \|
\| \`repo\` \| string \| Yes \| The name of the Space repository where the variable will be created or updated. For example, for Space 'huggingface/my-space', the repo is 'my-space'. \|
\| \`value\` \| string \| No \| The value of the variable. This will be stored and can be accessed by the Space. Defaults to empty string if not provided. \|
\| \`namespace\` \| string \| Yes \| The namespace (username or organization) that owns the Space. For example, for Space 'huggingface/my-space', the namespace is 'huggingface'. \|
\| \`description\` \| string \| No \| Optional description of the variable to help identify its purpose. For example: 'Environment mode setting', 'Debug flag for development'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create SQL Console Embed

\*\*Slug:\*\* \`HUGGING\_FACE\_CREATE\_SQL\_CONSOLE\_EMBED\`

Tool to create a SQL Console embed for querying datasets on Hugging Face. Use when you need to create a shareable SQL query interface for exploring dataset splits. The embed allows users to execute SQL queries against dataset views (e.g., train, test, validation splits).

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`sql\` \| string \| Yes \| The SQL query to be embedded in the console. This is the query users will see and can execute. \|
\| \`repo\` \| string \| Yes \| The name of the dataset repository without the namespace prefix. \|
\| \`title\` \| string \| Yes \| Title for the SQL console embed. Maximum 200 characters. \|
\| \`views\` \| array \| Yes \| List of available views (splits) in the dataset that can be queried. Must contain at least one view. \|
\| \`private\` \| boolean \| No \| Whether the SQL console embed should be private. If true, only authorized users can access it. \|
\| \`repoType\` \| string ("datasets") \| No \| The type of repository. Currently only 'datasets' is supported. \|
\| \`namespace\` \| string \| Yes \| The namespace (username or organization) that owns the dataset repository. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Create Webhook

\*\*Slug:\*\* \`HUGGING\_FACE\_CREATE\_WEBHOOK\`

Tool to create a webhook on Hugging Face that triggers on repository or discussion events. Use when you need to receive notifications for changes to specific models, datasets, or spaces.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`url\` \| string \| Yes \| The webhook URL endpoint that will receive POST requests when events occur. Must be a valid HTTP/HTTPS URL. \|
\| \`secret\` \| string \| No \| Optional secret string used to sign webhook payloads for verification. Must contain only printable ASCII characters (spaces and characters from 0x20 to 0x7F). \|
\| \`domains\` \| array \| Yes \| List of event domains to monitor. At least one domain must be specified. Use 'repo' for repository events or 'discussion' for discussion events. \|
\| \`watched\` \| array \| Yes \| List of repositories to watch for changes. At least one repository must be specified. Events from these repositories will trigger webhook calls. \|
\| \`job\_source\_id\` \| string \| No \| Optional job source identifier for associating the webhook with a specific job source. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete dataset branch

\*\*Slug:\*\* \`HUGGING\_FACE\_DELETE\_DATASETS\_BRANCH\`

Tool to delete a branch from a Hugging Face dataset repository. Use when you need to remove a branch that is no longer needed. This action permanently removes the specified branch from the dataset.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rev\` \| string \| Yes \| The name of the branch to delete from the dataset repository. This should be a valid branch name (not the main/master branch in most cases). \|
\| \`repo\` \| string \| Yes \| The name of the dataset repository from which to delete the branch. This is the repository identifier without the namespace. \|
\| \`namespace\` \| string \| Yes \| The namespace (user or organization) that owns the dataset. For example, '121tester' for a user or 'huggingface' for an organization. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Dataset Tag

\*\*Slug:\*\* \`HUGGING\_FACE\_DELETE\_DATASETS\_TAG\`

Tool to delete a tag from a Hugging Face dataset. Use when you need to remove a specific tag revision from a dataset repository.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rev\` \| string \| Yes \| The tag revision to delete from the dataset. \|
\| \`repo\` \| string \| Yes \| The repository name of the dataset. \|
\| \`namespace\` \| string \| Yes \| The namespace (organization or user) that owns the dataset. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete discussion

\*\*Slug:\*\* \`HUGGING\_FACE\_DELETE\_DISCUSSIONS\`

Tool to delete a discussion from a Hugging Face repository. Use when you need to remove a discussion that is no longer needed. This action permanently removes the specified discussion from the repository.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`num\` \| string \| Yes \| The discussion number to delete. This is the unique identifier of the discussion within the repository. \|
\| \`repo\` \| string \| Yes \| The name of the repository containing the discussion to delete. This is the repository identifier without the namespace. \|
\| \`namespace\` \| string \| Yes \| The namespace (user or organization) that owns the repository. For example, '121tester' for a user or 'huggingface' for an organization. \|
\| \`repo\_type\` \| string ("models" \| "spaces" \| "datasets") \| Yes \| The type of repository where the discussion exists. Must be one of: models, spaces, or datasets. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete network CIDR list

\*\*Slug:\*\* \`HUGGING\_FACE\_DELETE\_NETWORK\_CIDR\_LIST\`

Tool to delete a network CIDR list entry from Hugging Face Inference Endpoints. Use when you need to remove a CIDR configuration that is no longer needed. This action permanently removes the specified CIDR from the namespace's network configuration.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`cidr\_id\` \| string \| Yes \| The unique identifier of the CIDR to delete. This is a hexadecimal ID that was returned when the CIDR was created. \|
\| \`namespace\` \| string \| Yes \| The namespace (user or organization) that owns the CIDR configuration. For example, '121tester' for a user or 'my-org' for an organization. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete notifications

\*\*Slug:\*\* \`HUGGING\_FACE\_DELETE\_NOTIFICATIONS\`

Tool to delete notifications from Hugging Face. Use when you need to remove notifications either by specific discussion IDs or by applying filters to delete multiple notifications at once. Supports targeted deletion (via discussion\_ids) or bulk deletion (via applyToAll with filter parameters).

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`p\` \| integer \| No \| Page number for pagination when filtering notifications. Defaults to 0 (first page). \|
\| \`mention\` \| string ("all" \| "participating" \| "mentions") \| No \| Enum for mention filter. \|
\| \`paper\_id\` \| string \| No \| Filter notifications by paper ID. Use this to delete notifications related to a specific paper. Only applies when applyToAll is true. \|
\| \`repo\_name\` \| string \| No \| Filter notifications by repository name. Use this to delete notifications from a specific repository. Format should be 'namespace/repo-name'. Only applies when applyToAll is true. \|
\| \`repo\_type\` \| string ("dataset" \| "model" \| "space" \| "bucket") \| No \| Enum for repository type filter. \|
\| \`article\_id\` \| string \| No \| Filter notifications by article ID. Use this to delete notifications related to a specific article. Only applies when applyToAll is true. \|
\| \`last\_update\` \| string \| No \| Filter notifications by last update timestamp. Use this to delete notifications updated before or after a specific time. Only applies when applyToAll is true. \|
\| \`post\_author\` \| string \| No \| Filter notifications by the username of the post author. Use this to delete notifications from a specific user. Only applies when applyToAll is true. \|
\| \`read\_status\` \| string ("all" \| "unread") \| No \| Enum for read status filter. \|
\| \`apply\_to\_all\` \| boolean \| No \| When true, applies the deletion to all notifications matching the filter criteria (readStatus, repoType, repoName, etc.). Use with caution as this will delete multiple notifications at once. Required when not using discussion\_ids. \|
\| \`discussion\_ids\` \| array \| No \| Array of specific discussion IDs to delete. Each ID must be exactly 24 hexadecimal characters. Use this for targeted deletion of specific notifications. If provided, other filter parameters are ignored. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Settings Webhook

\*\*Slug:\*\* \`HUGGING\_FACE\_DELETE\_SETTINGS\_WEBHOOKS\`

Tool to delete a webhook from Hugging Face settings. Use when you need to remove a webhook configuration that is no longer needed.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`webhookId\` \| string \| Yes \| The unique identifier of the webhook to delete. Must be a 24-character hexadecimal string. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete space branch

\*\*Slug:\*\* \`HUGGING\_FACE\_DELETE\_SPACES\_BRANCH\`

Tool to delete a branch from a Hugging Face space repository. Use when you need to remove a branch that is no longer needed. This action permanently removes the specified branch from the space.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rev\` \| string \| Yes \| The name of the branch to delete from the space repository. This should be a valid branch name (not the main branch in most cases). \|
\| \`repo\` \| string \| Yes \| The name of the space repository from which to delete the branch. This is the repository identifier without the namespace. \|
\| \`namespace\` \| string \| Yes \| The namespace (user or organization) that owns the space. For example, '121tester' for a user or 'huggingface' for an organization. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete space secret

\*\*Slug:\*\* \`HUGGING\_FACE\_DELETE\_SPACES\_SECRETS\`

Tool to delete a secret from a Hugging Face space. Use when you need to remove sensitive credentials or configuration values that are no longer needed. This action permanently removes the specified secret from the space's environment variables.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`key\` \| string \| Yes \| The key name of the secret to delete from the space. This should be the exact name of the secret as it appears in the space's settings. \|
\| \`repo\` \| string \| Yes \| The name of the space repository from which to delete the secret. This is the repository identifier without the namespace. \|
\| \`namespace\` \| string \| Yes \| The namespace (user or organization) that owns the space. For example, '121tester' for a user or 'huggingface' for an organization. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete Spaces Tag

\*\*Slug:\*\* \`HUGGING\_FACE\_DELETE\_SPACES\_TAG\`

Tool to delete a tag from a Hugging Face space. Use when you need to remove a specific tag revision from a space repository.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rev\` \| string \| Yes \| The tag revision to delete from the space. \|
\| \`repo\` \| string \| Yes \| The repository name of the space. \|
\| \`namespace\` \| string \| Yes \| The namespace (organization or user) that owns the space. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Delete space variable

\*\*Slug:\*\* \`HUGGING\_FACE\_DELETE\_SPACES\_VARIABLES\`

Tool to delete a variable from a Hugging Face space. Use when you need to remove configuration values or environment variables that are no longer needed. This action permanently removes the specified variable from the space's environment.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`key\` \| string \| Yes \| The key name of the variable to delete from the space. This should be the exact name of the variable as it appears in the space's settings. \|
\| \`repo\` \| string \| Yes \| The name of the space repository from which to delete the variable. This is the repository identifier without the namespace. \|
\| \`namespace\` \| string \| Yes \| The namespace (user or organization) that owns the space. For example, '121tester' for a user or 'huggingface' for an organization. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Filter dataset rows

\*\*Slug:\*\* \`HUGGING\_FACE\_FILTER\_DATASET\_ROWS\`

Tool to filter rows in a Hugging Face dataset split based on SQL-like query conditions. Use when you need to search or filter specific rows from a dataset based on column values, or to retrieve sorted subsets of data.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`split\` \| string \| Yes \| Name of the dataset split to filter (e.g., 'train', 'test', 'validation'). \|
\| \`where\` \| string \| Yes \| SQL WHERE clause for filtering rows. Use column names and comparison operators (e.g., 'label=0', 'score>0.5', 'text LIKE "%happy%"'). Multiple conditions can be combined with AND/OR. \|
\| \`config\` \| string \| Yes \| Name of the dataset configuration/subset to filter. Use 'default' for datasets without explicit configs. \|
\| \`length\` \| integer \| No \| Maximum number of rows to return. Defaults to 100. Maximum allowed is 100. \|
\| \`offset\` \| integer \| No \| Number of rows to skip before returning results. Use with length for pagination. \|
\| \`dataset\` \| string \| Yes \| Full name of the dataset in the format 'namespace/dataset-name'. Example: 'cornell-movie-review-data/rotten\_tomatoes'. \|
\| \`orderby\` \| string \| No \| SQL ORDER BY clause for sorting results. Specify column name and optionally 'ASC' or 'DESC' (e.g., 'score DESC', 'date ASC'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Generate Chat Completion

\*\*Slug:\*\* \`HUGGING\_FACE\_GENERATE\_CHAT\_COMPLETION\`

Tool to generate a response given a list of messages in a conversational context. Supports both conversational Language Models (LLMs) and Vision-Language Models (VLMs). Compatible with OpenAI SDK.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`seed\` \| integer \| No \| Random seed for deterministic sampling. Using the same seed with the same parameters should produce the same output. \|
\| \`stop\` \| array \| No \| Up to 4 sequences where the API will stop generating further tokens. The returned text will not contain the stop sequence. \|
\| \`model\` \| string \| Yes \| The model ID to use for chat completion. Format: namespace/model or namespace/model:provider. Examples: 'meta-llama/Llama-3.2-3B-Instruct', 'Qwen/Qwen2.5-7B-Instruct-1M'. \|
\| \`tools\` \| array \| No \| A list of tools the model may call. Currently, only functions are supported as a tool. Use this to provide a list of functions the model may generate JSON inputs for. \|
\| \`top\_p\` \| number \| No \| An alternative to sampling with temperature, called nucleus sampling. The model considers the results of tokens with top\_p probability mass. So 0.1 means only tokens comprising the top 10% probability mass are considered. \|
\| \`stream\` \| boolean \| No \| Whether to stream the response as Server-Sent Events. If true, tokens are returned as they are generated. If false (default), the full response is returned at once. \|
\| \`logprobs\` \| boolean \| No \| Whether to return log probabilities of the output tokens. If true, returns the log probabilities of each output token returned in the content of message. \|
\| \`messages\` \| array \| Yes \| A list of messages comprising the conversation so far. Each message has a role (system, user, assistant, tool) and content. \|
\| \`max\_tokens\` \| integer \| No \| The maximum number of tokens that can be generated in the chat completion. If not specified, the model will generate until it reaches a natural stopping point. \|
\| \`temperature\` \| number \| No \| Sampling temperature between 0 and 2. Higher values like 0.8 make output more random, lower values like 0.2 make it more focused and deterministic. We generally recommend altering this or top\_p but not both. \|
\| \`tool\_choice\` \| string \| No \| Controls which (if any) tool is called by the model. 'auto' (default) means the model can pick between generating a message or calling a tool. 'none' means the model will not call a tool. 'required' means the model must call a tool. Or specify a particular function to force the model to call it. \|
\| \`tool\_prompt\` \| string \| No \| A prompt to be appended before the tools section. \|
\| \`top\_logprobs\` \| integer \| No \| An integer between 0 and 5 specifying the number of most likely tokens to return at each token position, each with an associated log probability. logprobs must be set to true if this parameter is used. \|
\| \`stream\_options\` \| object \| No \| Stream options. \|
\| \`response\_format\` \| string \| No \| The format of the response. Can be 'text' (default), 'json\_object' for JSON mode, or 'json\_schema' for structured output with a specific schema. \|
\| \`presence\_penalty\` \| number \| No \| Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics. \|
\| \`frequency\_penalty\` \| number \| No \| Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Generate Text Embeddings

\*\*Slug:\*\* \`HUGGING\_FACE\_GENERATE\_EMBEDDINGS\`

Tool to convert text into vector embeddings for feature extraction, semantic search, and similarity tasks. Use when you need numerical representations of text for ML applications.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`model\` \| string \| No \| The Hugging Face model ID to use for generating embeddings. Must be a valid embedding model from the Hugging Face model hub. \|
\| \`inputs\` \| array \| Yes \| Array of text strings to convert into embeddings. Each string will be processed and returned as a numerical vector representation. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Daily Papers

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_DAILY\_PAPERS\`

Tool to retrieve daily papers from Hugging Face. Use when you need to fetch the latest AI/ML research papers shared on Hugging Face.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`p\` \| integer \| No \| Page number for pagination (0-indexed). Defaults to 0. \|
\| \`date\` \| string \| No \| Filter papers by specific date (YYYY-MM-DD format). \|
\| \`sort\` \| string ("publishedAt" \| "trending") \| No \| Sort option for daily papers. \|
\| \`week\` \| string \| No \| Filter papers by specific week. \|
\| \`limit\` \| integer \| No \| Maximum number of papers to return per page. Defaults to 50. \|
\| \`month\` \| string \| No \| Filter papers by specific month (YYYY-MM format). \|
\| \`submitter\` \| string \| No \| Filter papers by submitter username. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Dataset Croissant Metadata

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_DATASET\_CROISSANT\`

Tool to get Croissant metadata about a Hugging Face dataset. Croissant is a metadata format built on schema.org aimed at describing datasets used for machine learning. Use when you need structured metadata in JSON-LD format.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`dataset\` \| string \| Yes \| Full dataset name in format 'namespace/repo' (e.g., 'ibm-research/duorc', 'squad', 'huggingface/transformers'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Dataset First Rows

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_DATASET\_FIRST\_ROWS\`

Tool to get the first 100 rows of a dataset split along with column data types and features. Use when you need to preview or sample dataset content.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`split\` \| string \| Yes \| Name of the dataset split to retrieve rows from. \|
\| \`config\` \| string \| Yes \| Name of the dataset configuration/subset. Use 'default' for datasets without configurations. \|
\| \`dataset\` \| string \| Yes \| Name of the dataset in format 'namespace/name'. For example, 'cornell-movie-review-data/rotten\_tomatoes' or 'squad'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Dataset Info

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_DATASET\_INFO\`

Tool to get general information about a dataset including description, citation, homepage, license, and features (column schemas). Use when you need to understand dataset structure, available splits, and metadata before working with the data.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`config\` \| string \| No \| Name of the config/subset to retrieve information for. If not provided, returns info for the default configuration. \|
\| \`dataset\` \| string \| Yes \| Name of the dataset to retrieve information for. Format: 'namespace/repo-name' (e.g., 'rajpurkar/squad', 'ibm/duorc'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Dataset Repository Info

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_DATASET\_REPO\_INFO\`

Tool to retrieve detailed information about a Hugging Face dataset repository. Use when you need metadata, card data, tags, downloads, likes, configurations, or other information about a specific dataset.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`repo\_id\` \| string \| Yes \| Dataset repository ID in the format author/dataset-name (e.g., 'rajpurkar/squad', 'stanfordnlp/imdb') \|
\| \`revision\` \| string \| No \| Git revision (branch, tag, or commit SHA) to retrieve information for. If not specified, defaults to the main branch \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Dataset Rows

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_DATASET\_ROWS\`

Tool to retrieve a slice of rows from a Hugging Face dataset split at any given location (offset). Returns up to 100 rows at a time with complete feature type information and no truncation. Use when you need to inspect specific rows from a dataset without downloading the entire dataset.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`split\` \| string \| Yes \| Name of the dataset split to retrieve rows from. Common splits include 'train', 'test', and 'validation'. \|
\| \`config\` \| string \| Yes \| Name of the config/subset of the dataset. Each dataset may have multiple configurations for different variations or subsets. \|
\| \`length\` \| integer \| Yes \| Number of rows to retrieve. Maximum allowed value is 100. Use smaller values for faster responses. \|
\| \`offset\` \| integer \| Yes \| Starting row index (0-based) from which to begin retrieving rows. Use 0 to start from the beginning of the dataset. \|
\| \`dataset\` \| string \| Yes \| Name of the dataset to retrieve rows from. Use format 'namespace/dataset\_name' (e.g., 'stanfordnlp/imdb', 'ibm/duorc'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Datasets Compare

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_DATASETS\_COMPARE\`

Tool to get a comparison (diff) between two revisions of a Hugging Face dataset. Use when you need to see what changed between dataset versions or commits.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`raw\` \| boolean \| No \| Whether to return the raw diff output. If false or not provided, returns formatted diff. \|
\| \`repo\` \| string \| Yes \| The name of the dataset repository to compare. \|
\| \`compare\` \| string \| Yes \| The comparison specification in the format 'base..head' (e.g., 'main~1..main' for comparing the previous commit to main, or 'abc123..def456' for comparing specific commits). \|
\| \`namespace\` \| string \| Yes \| The namespace (username or organization) that owns the dataset. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Dataset Size

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_DATASET\_SIZE\`

Tool to get the size of a Hugging Face dataset including number of rows and size in bytes. Use when you need to determine dataset size, memory requirements, or storage needs for a specific dataset.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`dataset\` \| string \| Yes \| Name of the dataset to get size information for. Format: 'namespace/repo-name' (e.g., 'stanfordnlp/imdb', 'ibm/duorc'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Datasets JWT

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_DATASETS\_JWT\`

Tool to generate a JWT token for accessing a Hugging Face dataset repository. Use when you need authenticated access to datasets, optionally with write access for spaces in dev mode, custom expiration, or encryption.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`repo\` \| string \| Yes \| The name of the dataset repository. \|
\| \`write\` \| string \| No \| Enable write access for spaces in dev mode. Set to 'true' to enable write access. \|
\| \`encrypted\` \| string \| No \| Request an encrypted JWT token. Set to 'true' to receive encrypted token with key ID. \|
\| \`namespace\` \| string \| Yes \| The namespace (organization or user) that owns the dataset repository. \|
\| \`expiration\` \| string \| No \| Custom expiration time for the JWT token. Format depends on Hugging Face API specifications. \|
\| \`inference\_api\` \| string \| No \| Enable inference API access. Set to 'true' to enable. \|
\| \`include\_pro\_status\` \| string \| No \| Include Pro status information in the token. Set to 'true' to include. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Datasets Leaderboard

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_DATASETS\_LEADERBOARD\`

Tool to retrieve evaluation results ranked by score for a dataset's leaderboard. Use when you need to compare model performance on a specific dataset or task. Returns an array of leaderboard entries with model information, scores, and rankings.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`repo\` \| string \| Yes \| The repository name of the dataset. For example, 'results' for the dataset 'open-llm-leaderboard/results'. \|
\| \`task\_id\` \| string \| No \| Optional task identifier to filter leaderboard results by a specific task. If not provided, returns results for all tasks. \|
\| \`namespace\` \| string \| Yes \| The namespace (organization or user) that owns the dataset. For example, 'open-llm-leaderboard' for the dataset 'open-llm-leaderboard/results'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Dataset Notebook URL

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_DATASETS\_NOTEBOOK\`

Tool to get a Jupyter notebook URL from a Hugging Face dataset repository. Use when you need to retrieve the URL for a specific .ipynb file from a dataset at a particular revision.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rev\` \| string \| Yes \| The git revision (branch, tag, or commit hash) to retrieve the notebook from. \|
\| \`path\` \| string \| Yes \| The path to the notebook file within the repository, including the .ipynb extension. \|
\| \`repo\` \| string \| Yes \| The repository name of the dataset. \|
\| \`namespace\` \| string \| Yes \| The namespace (user or organization) that owns the dataset. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Datasets Resolve

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_DATASETS\_RESOLVE\`

Tool to resolve and download a file from a Hugging Face dataset repository. This endpoint requires following redirections to retrieve file content or returns XET file info when Accept header is set appropriately. Use when you need to access files from datasets with proper redirection handling.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rev\` \| string \| Yes \| The git revision (commit SHA, branch name, or tag) to resolve the file from. \|
\| \`path\` \| string \| Yes \| The path to the file within the repository (wildcard path parameter). \|
\| \`repo\` \| string \| Yes \| The name of the dataset repository. \|
\| \`Range\` \| string \| No \| The range in bytes of the file to download (e.g., 'bytes=0-1023' for first 1KB). \|
\| \`Accept\` \| string \| No \| Returns json information about the XET file info if the file is a XET file. Use 'application/vnd.xet-fileinfo+json' to get XET metadata, otherwise leave empty to download file content. \|
\| \`namespace\` \| string \| Yes \| The namespace (organization or user) that owns the dataset repository. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Dataset Security Scan

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_DATASETS\_SCAN\`

Tool to retrieve the security scan status of a Hugging Face dataset repository. Use when you need to check for malware, pickle vulnerabilities, or other security issues in a dataset.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`repo\` \| string \| Yes \| The name of the dataset repository to scan \|
\| \`namespace\` \| string \| Yes \| The namespace (organization or user) that owns the dataset repository \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Dataset Tags by Type

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_DATASETS\_TAGS\_BY\_TYPE\`

Tool to retrieve all possible tags used for datasets on Hugging Face, grouped by tag type. Use when you need to discover available dataset classification tags, filter options, or metadata categories. Optionally restrict results to a single tag type.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`type\` \| string ("benchmark" \| "task\_categories" \| "size\_categories" \| "modality" \| "format" \| "library" \| "language" \| "license" \| "arxiv" \| "doi" \| "region" \| "other" \| "task\_ids" \| "annotations\_creators" \| "language\_creators" \| "multilinguality" \| "source\_datasets") \| No \| Valid tag type values for filtering dataset tags. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Dataset Statistics

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_DATASET\_STATISTICS\`

Tool to get comprehensive statistics about a dataset split including column statistics and data distribution information. Use when you need to analyze dataset composition, understand data distributions, or get statistical summaries of dataset features.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`split\` \| string \| Yes \| Name of the split to get statistics for (e.g., 'train', 'test', 'validation'). \|
\| \`config\` \| string \| Yes \| Name of the configuration/subset of the dataset (e.g., 'mnist', 'cola', 'default'). \|
\| \`dataset\` \| string \| Yes \| Name of the dataset. Format: 'namespace/dataset-name' (e.g., 'ylecun/mnist', 'nyu-mll/glue'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get dataset repository size

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_DATASETS\_TREESIZE\`

Tool to get the total size of a Hugging Face dataset repository at a specific revision and path. Use when you need to determine storage requirements or track repository size changes.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rev\` \| string \| Yes \| The Git revision or branch name to query (e.g., 'main', 'dev', or a commit SHA). \|
\| \`path\` \| string \| No \| The path within the repository to calculate size for. Use '.' for root directory or specify a subdirectory path (e.g., 'data/train'). The size is calculated recursively for all files under this path. \|
\| \`repo\` \| string \| Yes \| The repository name of the dataset (e.g., 'gsm8k', 'wikitext'). \|
\| \`namespace\` \| string \| Yes \| The namespace or organization name that owns the dataset (e.g., 'squad', 'openai'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Datasets XET Read Token

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_DATASETS\_XET\_READ\_TOKEN\`

Tool to get a read short-lived access token for XET from Hugging Face datasets. Use when you need temporary read access to dataset content through XET protocol.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rev\` \| string \| Yes \| The revision (branch, tag, or commit) to get the token for. Use 'main' for the default branch. \|
\| \`repo\` \| string \| Yes \| The repository name of the dataset. For example, 'squad' for the SQuAD dataset. \|
\| \`namespace\` \| string \| Yes \| The namespace (organization or user) that owns the dataset. For example, 'rajpurkar' for the SQuAD dataset. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Discussion Details

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_DISCUSSION\`

Tool to get detailed information about a specific discussion or pull request on Hugging Face Hub. Use when you need to retrieve all comments, status changes, events, and for PRs, the diff information.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`repo\_id\` \| string \| Yes \| Repository ID in the format author/repo-name (e.g., 'google-bert/bert-base-uncased'). \|
\| \`repo\_type\` \| string ("models" \| "spaces" \| "datasets") \| Yes \| The type of repository: models, spaces, or datasets. This determines where to look for the discussion. \|
\| \`discussion\_num\` \| integer \| Yes \| Discussion number (strictly positive integer). This is the unique identifier of the discussion within the repository. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Available Job Hardware

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_JOBS\_HARDWARE\`

Tool to retrieve available hardware configurations for Hugging Face Jobs with their specifications and pricing. Use when you need to discover compute options for running jobs.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Model Information

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_MODEL\_INFO\`

Tool to retrieve detailed information about a Hugging Face model repository. Use when you need comprehensive metadata including downloads, likes, tags, configuration, files, and more.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`repo\` \| string \| Yes \| The repository name of the model. For example, 'bert-base-uncased' in 'google-bert/bert-base-uncased'. \|
\| \`namespace\` \| string \| Yes \| The namespace (organization or user) that owns the model repository. For example, 'google-bert' in 'google-bert/bert-base-uncased'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Models Compare

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_MODELS\_COMPARE\`

Tool to compare two revisions of a Hugging Face model repository. Returns a git diff showing file changes between commits. Use when you need to see what changed between model versions.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`raw\` \| boolean \| No \| If true, returns raw diff output. If false or omitted, returns formatted diff. \|
\| \`repo\` \| string \| Yes \| The repository name of the model (e.g., 'bert-base-uncased', 'llama-2-7b'). \|
\| \`compare\` \| string \| Yes \| Comparison specification in the format 'commit1..commit2' (two dots). Each commit is a full Git commit hash. For example: '5546055f03398095e385d7dc625e636cc8910bf2..86b5e0934494bd15c9632b12f734a8a67f723594'. Do NOT use three dots (...) as this format is not supported by the API. \|
\| \`namespace\` \| string \| Yes \| The namespace or organization name that owns the model (e.g., 'google-bert', 'meta-llama', 'openai'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Models JWT

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_MODELS\_JWT\`

Tool to generate a JWT token for accessing a Hugging Face model repository. Use when you need authenticated access to models, with optional write access for spaces in dev mode, custom expiration, and encryption support.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`repo\` \| string \| Yes \| The repository name within the namespace. \|
\| \`write\` \| string \| No \| Enable write access for spaces in dev mode. Set to 'true' to enable write access. \|
\| \`encrypted\` \| string \| No \| Request an encrypted token. Set to 'true' to receive an encrypted JWT token and key ID. \|
\| \`namespace\` \| string \| Yes \| The namespace (organization or user) that owns the model repository. \|
\| \`expiration\` \| string \| No \| Custom expiration time for the JWT token. Specify the duration or timestamp for token validity. \|
\| \`inference\_api\` \| string \| No \| Enable inference API access with the token. Set to 'true' to enable. \|
\| \`include\_pro\_status\` \| string \| No \| Include PRO subscription status in the token. Set to 'true' to include PRO status information. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Models Notebook

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_MODELS\_NOTEBOOK\`

Tool to retrieve a Jupyter notebook URL from a Hugging Face model repository. Use when you need to access or display a notebook file stored in a model repository.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rev\` \| string \| Yes \| The revision, branch name, tag, or commit hash to retrieve the notebook from (e.g., 'main', 'dev', or a commit SHA). \|
\| \`path\` \| string \| Yes \| The path to the Jupyter notebook file within the repository, including the .ipynb extension (e.g., 'Untitled.ipynb' or 'notebooks/demo.ipynb'). \|
\| \`repo\` \| string \| Yes \| The repository name of the model (e.g., 'example-huggingface-model'). \|
\| \`namespace\` \| string \| Yes \| The namespace or organization name that owns the model repository (e.g., 'akshat-shethia'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Model Security Scan Status

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_MODELS\_SCAN\`

Tool to retrieve the security scan status of a Hugging Face model repository. Use when you need to check if a model has been scanned for security issues and view any detected problems.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`repo\` \| string \| Yes \| The repository name of the model. For example, 'opt-125m' in 'facebook/opt-125m'. \|
\| \`namespace\` \| string \| Yes \| The namespace (organization or user) that owns the model repository. For example, 'facebook' in 'facebook/opt-125m'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get model repository size

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_MODELS\_TREESIZE\`

Tool to get the total size of a Hugging Face model repository at a specific revision and path. Use when you need to determine storage requirements or track repository size changes.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rev\` \| string \| Yes \| The Git revision or branch name to query (e.g., 'main', 'dev', or a commit SHA). \|
\| \`path\` \| string \| No \| The path within the repository to calculate size for. Use '.' for root directory or specify a subdirectory path (e.g., 'weights', 'config'). The size is calculated recursively for all files under this path. \|
\| \`repo\` \| string \| Yes \| The repository name of the model (e.g., 'bert-base-uncased', 'llama-2-7b'). \|
\| \`namespace\` \| string \| Yes \| The namespace or organization name that owns the model (e.g., 'google-bert', 'facebook', 'openai'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Model XET Read Token

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_MODELS\_XET\_READ\_TOKEN\`

Tool to retrieve a short-lived XET read access token for a Hugging Face model repository. Use when you need to access XET (eXtensible Tensor) data for a specific model revision.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rev\` \| string \| Yes \| The revision (branch, tag, or commit hash) to get the XET read token for. Common values include 'main', 'master', or specific commit hashes. \|
\| \`repo\` \| string \| Yes \| The repository name of the model. For example, 'bert-base-uncased' in 'google-bert/bert-base-uncased'. \|
\| \`namespace\` \| string \| Yes \| The namespace (organization or user) that owns the model repository. For example, 'google-bert' in 'google-bert/bert-base-uncased'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Model Tags By Type

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_MODEL\_TAGS\_BY\_TYPE\`

Tool to retrieve all possible tags used for Hugging Face models, grouped by tag type. Use when you need to discover available model tags for filtering or categorization. Optionally restrict results to a specific tag type.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`type\` \| string ("pipeline\_tag" \| "library" \| "dataset" \| "language" \| "license" \| "arxiv" \| "doi" \| "region" \| "other") \| No \| Enum for model tag types on Hugging Face. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Organization Avatar

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_ORGANIZATIONS\_AVATAR\`

Tool to retrieve the avatar URL for a Hugging Face organization. Use when you need to get the avatar image URL for a specific organization.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| The name of the organization. For example, 'huggingface' or 'meta-llama'. \|
\| \`redirect\` \| string \| No \| If provided, redirect to the avatar URL instead of returning it as JSON. Set to any value to enable redirection. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Organization Members

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_ORGANIZATIONS\_MEMBERS\`

Tool to retrieve a list of members for a Hugging Face organization. Use when you need to discover who belongs to an organization, with optional filtering by search terms, email, and pagination support.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| Name of the organization to retrieve members from. This is the organization's username or slug on Hugging Face. \|
\| \`email\` \| string \| No \| Filter members by email address. This may require admin permissions depending on the organization's settings. \|
\| \`limit\` \| integer \| No \| Maximum number of members to return. Defaults to 500. \|
\| \`cursor\` \| string \| No \| Pagination cursor for fetching the next page of results. Use the cursor from the previous response to get more members. \|
\| \`search\` \| string \| No \| Search query to filter members by username or full name. Use this to find specific members within the organization. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Organization Social Handles

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_ORGANIZATIONS\_SOCIALS\`

Tool to retrieve an organization's social media handles from Hugging Face. Use when you need to find an organization's GitHub, LinkedIn, or Twitter/X profiles. Only returns handles that the organization has publicly shared on their Hugging Face profile.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`name\` \| string \| Yes \| The name of the organization to retrieve social media handles for. This is the organization's username on Hugging Face. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Resolve

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_RESOLVE\`

Tool to resolve a file in a Hugging Face repository. Use when you need to access files from model, dataset, or space repositories. This endpoint follows redirections (302, 307) to retrieve the actual file. When Accept header is set to 'application/vnd.xet-fileinfo+json', returns JSON file metadata instead of redirecting to file content.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rev\` \| string \| Yes \| The revision (branch, tag, or commit hash) to resolve. Common values include 'main' or specific Git commit SHAs. \|
\| \`path\` \| string \| Yes \| The file path within the repository to resolve. For example, 'config.json', 'pytorch\_model.bin', or 'tokenizer.json'. \|
\| \`repo\` \| string \| Yes \| The repository name within the namespace. For example, 'bart-large' in 'facebook/bart-large'. \|
\| \`Range\` \| string \| No \| The range in bytes of the file to download. Use HTTP Range header format like 'bytes=0-1023' to download only specific byte ranges. \|
\| \`Accept\` \| string \| No \| Returns JSON information about the XET file info if the file is a XET file. Set to 'application/vnd.xet-fileinfo+json' to receive JSON file metadata instead of following redirect to file content. \|
\| \`namespace\` \| string \| Yes \| The namespace (organization or user) that owns the repository. For example, 'facebook' in 'facebook/bart-large'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Resolve Cache Datasets

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_RESOLVE\_CACHE\_DATASETS\`

Tool to resolve a file from cache in a Hugging Face dataset repository. This endpoint follows redirections (302, 307) to retrieve file content or returns XET file info when Accept header is set appropriately. Use when you need to access cached files from datasets with proper redirection handling.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rev\` \| string \| Yes \| The git revision (commit SHA, branch, or tag) to resolve the file from. Note: This endpoint typically requires an exact commit SHA rather than branch names. \|
\| \`path\` \| string \| Yes \| The path to the file within the repository (wildcard path parameter). \|
\| \`repo\` \| string \| Yes \| The name of the dataset repository. \|
\| \`Range\` \| string \| No \| The range in bytes of the file to download (e.g., 'bytes=0-1023' for first 1KB). \|
\| \`Accept\` \| string \| No \| Returns json information about the XET file info if the file is a XET file. Use 'application/vnd.xet-fileinfo+json' to get XET metadata, otherwise leave empty to download file content. \|
\| \`namespace\` \| string \| Yes \| The namespace (organization or user) that owns the dataset repository. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Resolve Cache Models

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_RESOLVE\_CACHE\_MODELS\`

Tool to resolve and retrieve files from the Hugging Face model cache. Use when you need to access model configuration files, tokenizer files, or other JSON metadata files from a specific model repository. This endpoint returns the actual file content as JSON for JSON files (e.g., config.json, tokenizer.json, tokenizer\_config.json).

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rev\` \| string \| Yes \| The revision to resolve. Must be a full Git commit SHA (40 characters). Branch names like 'main' or tags are not supported by this endpoint. \|
\| \`path\` \| string \| Yes \| The file path within the repository to resolve. For example, 'config.json', 'pytorch\_model.bin', or 'tokenizer.json'. \|
\| \`repo\` \| string \| Yes \| The repository name of the model. For example, 'bert-base-uncased' in 'google-bert/bert-base-uncased'. \|
\| \`Range\` \| string \| No \| The range in bytes of the file to download. Use HTTP Range header format like 'bytes=0-1023'. \|
\| \`Accept\` \| string \| No \| Optional Accept header to specify the desired response format. Common values include 'application/json', 'application/vnd.xet-fileinfo+json', or '\*/\*'. \|
\| \`namespace\` \| string \| Yes \| The namespace (organization or user) that owns the model repository. For example, 'google-bert' in 'google-bert/bert-base-uncased'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Resolve Cache Spaces

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_RESOLVE\_CACHE\_SPACES\`

Tool to resolve and retrieve a file from Hugging Face Spaces cache. Use when you need to download a file from a Space repository or get XET file information. This endpoint follows redirections (HTTP 302/307) to resolve the final file location.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rev\` \| string \| Yes \| The git revision (branch, tag, or commit hash) to retrieve the file from. Use a full commit SHA for exact version, or 'main' for the default branch. \|
\| \`path\` \| string \| Yes \| The path to the file within the repository. This is a wildcard path parameter that can include subdirectories and filename. \|
\| \`repo\` \| string \| Yes \| The repository name of the Space. For example, 'gradio-user-history' for the Wauplin/gradio-user-history Space. \|
\| \`Range\` \| string \| No \| The range in bytes of the file to download. Format: 'bytes=start-end'. If not provided, the entire file will be retrieved. \|
\| \`Accept\` \| string \| No \| Accept header to specify the response format. Use 'application/vnd.xet-fileinfo+json' to get JSON information about XET file info instead of the file content. \|
\| \`namespace\` \| string \| Yes \| The namespace (user or organization) that owns the Space. For example, 'Wauplin' for the Wauplin/gradio-user-history Space. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Jobs Usage

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_SETTINGS\_BILLING\_USAGE\_JOBS\`

Tool to retrieve Jobs usage and billing information for the current subscription period from Hugging Face. Use when you need to check compute usage, costs, or job execution details for the authenticated user or organization.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Live Billing Usage

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_SETTINGS\_BILLING\_USAGE\_LIVE\`

Tool to retrieve live billing usage stream from Hugging Face. Use when you need real-time updates on storage, inference, Zero GPU usage, and rate limits.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`timeout\` \| integer \| No \| Maximum time in seconds to wait for live usage updates. Defaults to 5 seconds. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Billing Usage V2

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_SETTINGS\_BILLING\_USAGE\_V2\`

Tool to retrieve user billing usage for a custom date range from Hugging Face. Use when you need to check usage statistics or resource consumption between specific dates using Unix timestamps.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`endDate\` \| integer \| Yes \| End date of the billing period as Unix timestamp (seconds since epoch). Defines the end of the date range for which to retrieve usage data. Must be after start\_date. \|
\| \`startDate\` \| integer \| Yes \| Start date of the billing period as Unix timestamp (seconds since epoch). Defines the beginning of the date range for which to retrieve usage data. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get MCP Settings

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_SETTINGS\_MCP\`

Tool to retrieve MCP (Model Context Protocol) tools configuration for the authenticated user. Use when you need to discover available built-in tools and space-based tools configured in the user's Hugging Face settings.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Settings Webhook

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_SETTINGS\_WEBHOOKS\`

Tool to retrieve a specific webhook configuration from Hugging Face settings. Use when you need to inspect webhook details, verify webhook status, or check webhook configuration for a given webhook ID.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`webhookId\` \| string \| Yes \| The unique identifier of the webhook to retrieve. Must be a 24-character hexadecimal string. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Space Info

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_SPACE\_INFO\`

Tool to retrieve detailed information about a Hugging Face Space repository. Use when you need metadata, SDK type, hardware configuration, runtime status, or other information about a specific Space.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`repo\_id\` \| string \| Yes \| Space repository ID in the format author/space-name (e.g., 'Qwen/Qwen3-TTS', 'stabilityai/stable-diffusion') \|
\| \`revision\` \| string \| No \| Git revision (branch, tag, or commit SHA) to retrieve information for. If not specified, defaults to the main branch \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Spaces Compare

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_SPACES\_COMPARE\`

Tool to compare two revisions of a Hugging Face Space repository. Returns a git diff showing file changes between commits. Use when you need to see what changed between Space versions.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`raw\` \| boolean \| No \| If true, returns raw diff output. If false or omitted, returns formatted diff. \|
\| \`repo\` \| string \| Yes \| The repository name of the Space (e.g., 'Qwen3-TTS', 'chatgpt-demo'). \|
\| \`compare\` \| string \| Yes \| Comparison specification in the format 'commit1..commit2' (two dots). Each commit is a full Git commit hash. For example: 'bb80b9adea7bc1d818bc635e839db60b7d4aa8f1..8a132844625e28e09f36427c30070276dfd9b2ed'. Do NOT use three dots (...) as this format is not supported by the API. \|
\| \`namespace\` \| string \| Yes \| The namespace or organization name that owns the Space (e.g., 'Qwen', 'openai', 'gradio'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Spaces Events

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_SPACES\_EVENTS\`

Tool to stream status updates for a Hugging Face Space using SSE protocol. Use when you need to monitor Space build stages, runtime status, or receive real-time updates about Space state changes.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`repo\` \| string \| Yes \| The repository name of the Space. \|
\| \`timeout\` \| integer \| No \| Maximum time in seconds to wait for status updates. Defaults to 5 seconds. \|
\| \`namespace\` \| string \| Yes \| The namespace (username or organization) that owns the Space. \|
\| \`session\_uuid\` \| string \| No \| Optional session UUID to filter events for a specific session. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Spaces JWT

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_SPACES\_JWT\`

Tool to generate a JWT token for accessing a Hugging Face space repository. Use when you need authenticated access to spaces, with optional write access for spaces in dev mode, custom expiration, and encryption support.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`repo\` \| string \| Yes \| The name of the space repository. \|
\| \`write\` \| string \| No \| Enable write access for spaces in dev mode. Set to 'true' to enable write access. \|
\| \`encrypted\` \| string \| No \| Request an encrypted token. Set to 'true' to receive an encrypted JWT token and key ID. \|
\| \`namespace\` \| string \| Yes \| The namespace (organization or user) that owns the space repository. \|
\| \`expiration\` \| string \| No \| Custom expiration time for the JWT token. Specify the duration or timestamp for token validity. \|
\| \`inference\_api\` \| string \| No \| Enable inference API access with the token. Set to 'true' to enable. \|
\| \`include\_pro\_status\` \| string \| No \| Include PRO subscription status in the token. Set to 'true' to include PRO status information. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Space Metrics

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_SPACES\_METRICS\`

Tool to get live metrics for a specific Space in a streaming fashion, with SSE protocol, such as current Zero-GPU usage. Use when you need real-time monitoring of Space resource utilization.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`repo\` \| string \| Yes \| The repository name of the Space. \|
\| \`timeout\` \| integer \| No \| Maximum time in seconds to wait for metrics updates. Defaults to 5 seconds. \|
\| \`namespace\` \| string \| Yes \| The namespace (username or organization) that owns the Space. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Spaces Notebook

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_SPACES\_NOTEBOOK\`

Tool to retrieve a Jupyter notebook URL from a Hugging Face space repository. Use when you need to access or display a notebook file stored in a space.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rev\` \| string \| Yes \| The revision, branch name, tag, or commit hash to retrieve the notebook from (e.g., 'main', 'dev', or a commit SHA). \|
\| \`path\` \| string \| Yes \| The path to the Jupyter notebook file within the repository, including the .ipynb extension (e.g., 'notebooks/automatic\_mask\_generator\_example.ipynb'). \|
\| \`repo\` \| string \| Yes \| The repository name of the space (e.g., 'SAM2-Video-Predictor'). \|
\| \`namespace\` \| string \| Yes \| The namespace or organization name that owns the space repository (e.g., 'fffiloni'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Spaces Resolve

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_SPACES\_RESOLVE\`

Tool to resolve and retrieve a file from a Hugging Face Space repository. Use when you need to download a file from a Space or get XET file information. This endpoint follows redirections (HTTP 302/307) to resolve the final file location.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rev\` \| string \| Yes \| The git revision (branch, tag, or commit hash) to retrieve the file from. Use 'main' for the default branch or a specific commit SHA for exact version. \|
\| \`path\` \| string \| Yes \| The file path within the repository to resolve. This wildcard path parameter can include subdirectories and filename. \|
\| \`repo\` \| string \| Yes \| The repository name of the Space. For example, 'stable-diffusion-3-medium' for the stabilityai/stable-diffusion-3-medium Space. \|
\| \`Range\` \| string \| No \| The range in bytes of the file to download. Format: 'bytes=start-end'. If not provided, the entire file will be retrieved. \|
\| \`Accept\` \| string \| No \| Accept header to specify the response format. Use 'application/vnd.xet-fileinfo+json' to get JSON information about XET file info instead of the file content. \|
\| \`namespace\` \| string \| Yes \| The namespace (user or organization) that owns the Space. For example, 'stabilityai' for the stabilityai/stable-diffusion-3-medium Space. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Space Security Scan Status

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_SPACES\_SCAN\`

Tool to retrieve the security scan status of a Hugging Face space repository. Use when you need to check for malware, pickle vulnerabilities, or other security issues in a space.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`repo\` \| string \| Yes \| The name of the space repository to check security status for \|
\| \`namespace\` \| string \| Yes \| The namespace (organization or user) that owns the space repository \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get space repository size

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_SPACES\_TREESIZE\`

Tool to get the total size of a Hugging Face space repository at a specific revision and path. Use when you need to determine storage requirements or track repository size changes.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rev\` \| string \| Yes \| The Git revision or branch name to query (e.g., 'main', 'dev', or a commit SHA). \|
\| \`path\` \| string \| No \| The path within the repository to calculate size for. Use '.' for root directory or specify a subdirectory path (e.g., 'static/images'). The size is calculated recursively for all files under this path. \|
\| \`repo\` \| string \| Yes \| The repository name of the space (e.g., 'hello\_world', 'chatbot'). \|
\| \`namespace\` \| string \| Yes \| The namespace or organization name that owns the space (e.g., 'gradio', 'huggingface'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Space XET Read Token

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_SPACES\_XET\_READ\_TOKEN\`

Tool to retrieve a short-lived XET read access token for a Hugging Face Space repository. Use when you need to access XET (eXtensible Tensor) data for a specific Space revision.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rev\` \| string \| Yes \| The revision (branch, tag, or commit hash) to get the XET read token for. Common values include 'main', 'master', or specific commit hashes. \|
\| \`repo\` \| string \| Yes \| The repository name of the Space. For example, 'Ace-Step-v1.5' in 'ACE-Step/Ace-Step-v1.5'. \|
\| \`namespace\` \| string \| Yes \| The namespace (organization or user) that owns the Space repository. For example, 'ACE-Step' in 'ACE-Step/Ace-Step-v1.5'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Spaces XET Write Token

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_SPACES\_XET\_WRITE\_TOKEN\`

Tool to retrieve a short-lived XET write access token for a Hugging Face space repository. Use when you need to upload or write XET data to a specific space revision.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rev\` \| string \| Yes \| The revision (branch, tag, or commit hash) to get the XET write token for. Common values include 'main', 'master', or specific commit hashes. \|
\| \`repo\` \| string \| Yes \| The repository name of the space. For example, 'ComfyUI' in 'SpacesExamples/ComfyUI'. \|
\| \`create\_pr\` \| integer \| No \| Pass 1 to enable PR creation mode for users without direct write access to the repository. When set, changes will be submitted as a pull request instead of direct commits. \|
\| \`namespace\` \| string \| Yes \| The namespace (organization or user) that owns the space repository. For example, 'SpacesExamples' in 'SpacesExamples/ComfyUI'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Trending Repositories

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_TRENDING\`

Tool to retrieve trending repositories from Hugging Face. Use when you need to discover popular models, datasets, or spaces that are currently trending on the platform.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`type\` \| string ("all" \| "dataset" \| "model" \| "space") \| No \| Repository type filter for trending repositories. \|
\| \`limit\` \| integer \| No \| Maximum number of trending repositories to return. Defaults to 10. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get User Avatar

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_USERS\_AVATAR\`

Tool to retrieve the avatar URL for a Hugging Face user. Use when you need to get the avatar image URL for a specific user.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`redirect\` \| string \| No \| If provided, redirect to the avatar URL instead of returning it as JSON. Set to any value to enable redirection. \|
\| \`username\` \| string \| Yes \| The username of the user whose avatar URL to retrieve. For example, 'julien-c' or 'lysandre'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get User Overview

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_USERS\_OVERVIEW\`

Tool to retrieve a comprehensive overview of a Hugging Face user's profile. Use when you need to get user statistics, organizations, activity counts, and profile information.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`username\` \| string \| Yes \| Username of the Hugging Face user to retrieve overview for. This is the user's handle on Hugging Face. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get User Social Handles

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_USERS\_SOCIALS\`

Tool to retrieve a user's social media handles from Hugging Face. Use when you need to find a user's GitHub, LinkedIn, Twitter/X, or Bluesky profiles. Only returns handles that the user has publicly shared on their Hugging Face profile.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`username\` \| string \| Yes \| The username of the Hugging Face user to retrieve social media handles for. This is the user's username on Hugging Face. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Get Authenticated User Info

\*\*Slug:\*\* \`HUGGING\_FACE\_GET\_WHOAMI\`

Tool to get information about the authenticated Hugging Face user including username, email, organizations, and token details. Use when you need to identify the current user from an access token or retrieve user profile information.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Handle Dataset User Access Request

\*\*Slug:\*\* \`HUGGING\_FACE\_HANDLE\_DATASETS\_USER\_ACCESS\_REQUEST\`

Tool to handle a user's access request to a gated Hugging Face dataset. Use this to accept, reject, or update the status of access requests for repositories with gated access. Either 'user' or 'userId' must be provided to identify the user.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`repo\` \| string \| Yes \| The repository name of the gated dataset. For example, 'test-gated-dataset-cancel'. \|
\| \`user\` \| string \| No \| The username of the user whose access request is being handled. Either 'user' or 'userId' must be provided, but not both. \|
\| \`status\` \| string ("accepted" \| "rejected" \| "pending") \| Yes \| The decision on the access request. Use 'accepted' to grant access, 'rejected' to deny access, or 'pending' to keep the request pending. \|
\| \`userId\` \| string \| No \| The user ID (24-character hexadecimal string) of the user whose access request is being handled. Either 'user' or 'userId' must be provided, but not both. \|
\| \`namespace\` \| string \| Yes \| The namespace (organization or user) that owns the dataset. For example, '121tester' or 'huggingface'. \|
\| \`rejectionReason\` \| string \| No \| The reason for rejecting the access request. Maximum 200 characters. Only applicable when status is 'rejected'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Collections

\*\*Slug:\*\* \`HUGGING\_FACE\_LIST\_COLLECTIONS\`

Tool to list collections on the Hugging Face Hub. Use when you need to discover collections of models, datasets, spaces, or papers. Collections are curated groups of repositories organized by users.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`q\` \| string \| No \| Search query to filter collections by title or description. Use keywords to find relevant collections. \|
\| \`item\` \| string \| No \| Filter collections by item ID (repo\_id, paper id, or collection slug). Use this to find collections containing a specific item. \|
\| \`sort\` \| string ("upvotes" \| "lastModified" \| "trending") \| No \| Enum for sorting options for collections. \|
\| \`limit\` \| integer \| No \| Maximum number of collections to return per page. Defaults to 10. \|
\| \`owner\` \| string \| No \| Filter collections by owner username. Use this to get collections created by a specific user or organization. \|
\| \`cursor\` \| string \| No \| Pagination cursor for fetching the next page of results. Use the cursor from the previous response to get more collections. \|
\| \`expand\` \| string \| No \| Comma-separated list of fields to expand in the response. Use this to get additional details about collections. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Dataset Parquet Files

\*\*Slug:\*\* \`HUGGING\_FACE\_LIST\_DATASET\_PARQUET\_FILES\`

Tool to get the list of Parquet files for a dataset. Use when you need to download or access dataset files in Parquet format. Returns URLs to download Parquet files with metadata about splits, configurations, and file sizes.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`dataset\` \| string \| Yes \| Name of the dataset to get Parquet files for. Format: 'namespace/repo-name' (e.g., 'rajpurkar/squad', 'huggingface/cifar10'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Dataset Paths Info

\*\*Slug:\*\* \`HUGGING\_FACE\_LIST\_DATASET\_PATHS\_INFO\`

Tool to list detailed information about specific paths in a Hugging Face dataset repository. Use when you need to get metadata about files or directories in a dataset, including size, type, commit history, and security scan status.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rev\` \| string \| Yes \| Git revision (branch, tag, or commit hash) to query \|
\| \`repo\` \| string \| Yes \| Dataset repository name \|
\| \`paths\` \| string \| Yes \| List of paths to get information about, or a single path string. Paths are relative to the repository root. \|
\| \`expand\` \| string \| Yes \| Whether to expand the response with last commit and security file status information. Can be a boolean or an object with expansion options. \|
\| \`namespace\` \| string \| Yes \| Namespace (user or organization) that owns the dataset \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Datasets

\*\*Slug:\*\* \`HUGGING\_FACE\_LIST\_DATASETS\`

Tool to list datasets on the Hugging Face Hub. Use when you need to discover or search for datasets. Supports filtering by author, search query, tags, and sorting by various properties.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`sort\` \| string ("lastModified" \| "trending" \| "likes" \| "downloads") \| No \| Enum for sorting properties. \|
\| \`limit\` \| integer \| No \| Limit the number of datasets returned. Defaults to 100 if not specified. \|
\| \`author\` \| string \| No \| Filter datasets by an author or organization. Use this to get datasets from a specific user or org. \|
\| \`cursor\` \| string \| No \| Pagination cursor for fetching the next page of results. Use the next\_cursor value from a previous response. \|
\| \`filter\` \| string \| No \| Filter based on tags. Use this to find datasets with specific tags like task types, languages, or licenses. \|
\| \`search\` \| string \| No \| Filter based on substrings for dataset names and their usernames. Use this to search for datasets by keyword. \|
\| \`direction\` \| string ("asc" \| "desc") \| No \| Enum for sort direction. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Dataset Commits

\*\*Slug:\*\* \`HUGGING\_FACE\_LIST\_DATASETS\_COMMITS\`

Tool to list commits from a Hugging Face dataset repository. Use when you need to retrieve the commit history for a specific dataset branch or revision.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`p\` \| integer \| No \| Page number for pagination. Starts from 0 for the first page. \|
\| \`rev\` \| string \| Yes \| The revision (branch, tag, or commit hash) to list commits from. \|
\| \`repo\` \| string \| Yes \| The repository name of the dataset. \|
\| \`limit\` \| integer \| No \| Maximum number of commits to return per page. Default is 50. \|
\| \`namespace\` \| string \| Yes \| The namespace (username or organization) that owns the dataset. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Dataset Splits

\*\*Slug:\*\* \`HUGGING\_FACE\_LIST\_DATASET\_SPLITS\`

Tool to get the list of subsets and splits of a dataset. Returns the available configurations and splits for a given dataset on the Hub. Use when you need to understand the structure of a dataset before querying specific splits.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`dataset\` \| string \| Yes \| Name of the dataset to retrieve splits for. Format: 'namespace/repo-name' (e.g., 'stanfordnlp/imdb', 'huggingface/squad'). \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Dataset References

\*\*Slug:\*\* \`HUGGING\_FACE\_LIST\_DATASETS\_REFS\`

Tool to list all references (branches, tags, converts, pull requests) in a Hugging Face dataset repository. Use when you need to retrieve available references for a specific dataset.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`repo\` \| string \| Yes \| The repository name of the dataset. \|
\| \`namespace\` \| string \| Yes \| The namespace (organization or user) that owns the dataset. \|
\| \`include\_prs\` \| boolean \| No \| Whether to include pull requests in the response. Set to true to include pull requests. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Dataset Access Requests

\*\*Slug:\*\* \`HUGGING\_FACE\_LIST\_DATASETS\_USER\_ACCESS\_REQUEST\`

Tool to list access requests for a gated Hugging Face dataset repository. Use when you need to view pending, accepted, or rejected access requests for datasets with restricted access.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`repo\` \| string \| Yes \| The repository name of the gated dataset \|
\| \`after\` \| string \| No \| Cursor for pagination - returns requests after this cursor \|
\| \`limit\` \| integer \| No \| Maximum number of access requests to return (default: 1000) \|
\| \`before\` \| string \| No \| Cursor for pagination - returns requests before this cursor \|
\| \`status\` \| string ("pending" \| "accepted" \| "rejected") \| Yes \| Filter access requests by status: pending, accepted, or rejected \|
\| \`namespace\` \| string \| Yes \| The namespace or organization name that owns the dataset \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Discussions

\*\*Slug:\*\* \`HUGGING\_FACE\_LIST\_DISCUSSIONS\`

Tool to list discussions for a Hugging Face repository. Use when you need to retrieve discussions or pull requests for a specific model, dataset, or space.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`p\` \| integer \| No \| Page number for pagination. Starts from 0 for the first page. \|
\| \`repo\` \| string \| Yes \| The repository name to list discussions from. \|
\| \`sort\` \| string ("recently-created" \| "trending" \| "reactions") \| No \| Sort type enum. \|
\| \`type\` \| string ("all" \| "discussion" \| "pull\_request") \| No \| Discussion type enum. \|
\| \`author\` \| string \| No \| Filter discussions by author username. \|
\| \`search\` \| string \| No \| Search query to filter discussions by title or content. \|
\| \`status\` \| string ("all" \| "open" \| "closed") \| No \| Discussion status enum. \|
\| \`namespace\` \| string \| Yes \| The namespace (username or organization) that owns the repository. \|
\| \`repo\_type\` \| string ("models" \| "spaces" \| "datasets") \| Yes \| Type of repository to list discussions from: models, spaces, or datasets. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Available Documentation

\*\*Slug:\*\* \`HUGGING\_FACE\_LIST\_DOCS\`

Tool to retrieve the list of available documentation from Hugging Face. Use when you need to discover available documentation resources.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Inference Endpoints

\*\*Slug:\*\* \`HUGGING\_FACE\_LIST\_ENDPOINTS\`

Tool to list Hugging Face Inference Endpoints for a specific user or organization. Use when you need to retrieve endpoints, optionally filtered by tags or name.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`tags\` \| string \| No \| Filter endpoints by tags (comma-separated). Use this to find endpoints with specific tags. \|
\| \`limit\` \| integer \| No \| Maximum number of endpoints to return per page. Defaults to 20 if not specified. \|
\| \`cursor\` \| string \| No \| Pagination cursor to fetch the next or previous page of results. Use the nextCursor or prevCursor from the previous response. \|
\| \`search\` \| string \| No \| Filter endpoints by name substring. Use this to search for endpoints containing specific text in their name. \|
\| \`namespace\` \| string \| Yes \| User or organization name to list endpoints for. This is the owner of the endpoints you want to retrieve. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Model Commits

\*\*Slug:\*\* \`HUGGING\_FACE\_LIST\_MODELS\_COMMITS\`

Tool to list commits from a Hugging Face model repository. Use when you need to retrieve the commit history for a specific model branch or revision.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`p\` \| integer \| No \| Page number for pagination. Starts from 0 for the first page. \|
\| \`rev\` \| string \| Yes \| The revision (branch, tag, or commit hash) to list commits from. \|
\| \`repo\` \| string \| Yes \| The repository name of the model. \|
\| \`limit\` \| integer \| No \| Maximum number of commits to return per page. Default is 50. \|
\| \`expand\` \| array \| No \| List of fields to expand in the response. Use 'formatted' to include formatted commit messages. \|
\| \`namespace\` \| string \| Yes \| The namespace (username or organization) that owns the model. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Model Paths Info

\*\*Slug:\*\* \`HUGGING\_FACE\_LIST\_MODELS\_PATHS\_INFO\`

Tool to list detailed information about specific paths in a Hugging Face model repository. Use when you need to get metadata about files or directories in a model, including size, type, commit history, and security scan status.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rev\` \| string \| Yes \| Git revision (branch, tag, or commit hash) to query \|
\| \`repo\` \| string \| Yes \| Model repository name \|
\| \`paths\` \| string \| Yes \| List of paths to get information about, or a single path string. Paths are relative to the repository root. \|
\| \`expand\` \| string \| Yes \| Whether to expand the response with last commit and security file status information. Can be a boolean or an object with expansion options. \|
\| \`namespace\` \| string \| Yes \| Namespace (user or organization) that owns the model \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Model References

\*\*Slug:\*\* \`HUGGING\_FACE\_LIST\_MODELS\_REFS\`

Tool to list all references (branches, tags, converts, and optionally pull requests) in a Hugging Face model repository. Use when you need to retrieve version control information for a specific model.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`repo\` \| string \| Yes \| Repository name within the namespace (e.g., 'bert-base-uncased') \|
\| \`namespace\` \| string \| Yes \| Namespace or organization name (e.g., 'google-bert', 'facebook') \|
\| \`include\_prs\` \| boolean \| No \| Whether to include pull requests in the response. Defaults to false. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Notifications

\*\*Slug:\*\* \`HUGGING\_FACE\_LIST\_NOTIFICATIONS\`

Tool to list notifications for the authenticated Hugging Face user. Use when you need to retrieve user notifications, optionally filtered by read status, repository type, author, or other criteria.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`p\` \| integer \| No \| Page number for pagination. Defaults to 0. \|
\| \`mention\` \| string ("all" \| "participating" \| "mentions") \| No \| Enum for mention filter. \|
\| \`paperId\` \| string \| No \| Filter notifications by paper ID. \|
\| \`repoName\` \| string \| No \| Filter notifications by repository name. \|
\| \`repoType\` \| string ("dataset" \| "model" \| "space" \| "bucket") \| No \| Enum for repository type filter. \|
\| \`articleId\` \| string \| No \| Filter notifications by article ID. \|
\| \`lastUpdate\` \| string \| No \| Filter notifications by last update timestamp. \|
\| \`postAuthor\` \| string \| No \| Filter notifications by the author of the post. \|
\| \`readStatus\` \| string ("all" \| "unread") \| No \| Enum for notification read status filter. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List repository files

\*\*Slug:\*\* \`HUGGING\_FACE\_LIST\_REPO\_FILES\`

Tool to get the file tree of a Hugging Face repository with pagination support. Use when you need to browse files and folders in any repository type (model, dataset, or space), explore repository structure, or discover available files.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`path\` \| string \| No \| Path within the repository to list. Use empty string or '.' for root directory. Supports nested paths. \|
\| \`limit\` \| integer \| No \| Maximum number of items to return. Defaults to 1000, or 100 when expand=true. Use with cursor for pagination. \|
\| \`cursor\` \| string \| No \| Pagination cursor from a previous response to fetch the next page of results. Omit for the first page. \|
\| \`expand\` \| boolean \| No \| If true, returns associated commit data for each entry and security scanner metadata. Defaults to false if not specified. \|
\| \`repo\_id\` \| string \| Yes \| Repository ID in the format author/repo-name. Example: 'google-bert/bert-base-uncased' for a model. \|
\| \`revision\` \| string \| No \| Git revision (branch, tag, or commit SHA) to list. Use 'main' for default branch. \|
\| \`recursive\` \| boolean \| No \| If true, returns the tree recursively including all subdirectories. Defaults to false if not specified. \|
\| \`repo\_type\` \| string ("model" \| "dataset" \| "space") \| Yes \| Repository type: model, dataset, or space. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Webhooks

\*\*Slug:\*\* \`HUGGING\_FACE\_LIST\_SETTINGS\_WEBHOOKS\`

Tool to list all webhooks configured in Hugging Face settings. Use when you need to retrieve webhook configurations for the authenticated user's account.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Spaces on Hugging Face Hub

\*\*Slug:\*\* \`HUGGING\_FACE\_LIST\_SPACES\`

Tool to list Spaces on the Hugging Face Hub with filtering options. Use when you need to discover or search for ML demo applications hosted on Hugging Face.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`sort\` \| string \| No \| Property to use when sorting results. Common values include 'lastModified', 'likes', 'trending', or 'created'. \|
\| \`limit\` \| integer \| No \| Maximum number of spaces to return in the response. Must be between 1 and 500. \|
\| \`author\` \| string \| No \| Filter spaces by a specific author or organization name. \|
\| \`filter\` \| string \| No \| Filter based on tags. You can specify tags to find spaces by SDK type (e.g., 'gradio', 'streamlit'), task type, or other characteristics. \|
\| \`search\` \| string \| No \| Filter based on substrings for repos and their usernames. Use to search for specific space names or authors. \|
\| \`direction\` \| string \| No \| Direction in which to sort results. Use '1' for ascending order or '-1' for descending order. Must be used together with the sort parameter. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Space Commits

\*\*Slug:\*\* \`HUGGING\_FACE\_LIST\_SPACES\_COMMITS\`

Tool to list commits from a Hugging Face Space repository. Use when you need to retrieve the commit history for a specific Space branch or revision.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`p\` \| integer \| No \| Page number for pagination. Starts from 0 for the first page. \|
\| \`rev\` \| string \| Yes \| The revision (branch, tag, or commit hash) to list commits from. \|
\| \`repo\` \| string \| Yes \| The repository name of the Space. \|
\| \`limit\` \| integer \| No \| Maximum number of commits to return per page. Default is 50. \|
\| \`expand\` \| array \| No \| List of fields to expand in the response. Use 'formatted' to include formatted commit messages. \|
\| \`namespace\` \| string \| Yes \| The namespace (username or organization) that owns the Space. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Available Space Hardware

\*\*Slug:\*\* \`HUGGING\_FACE\_LIST\_SPACES\_HARDWARE\`

Tool to retrieve available hardware configurations for Hugging Face Spaces with their specifications and pricing. Use when you need to discover compute options for running spaces.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Space LFS Files

\*\*Slug:\*\* \`HUGGING\_FACE\_LIST\_SPACES\_LFS\_FILES\`

Tool to list LFS (Large File Storage) files from a Hugging Face Space repository. Use when you need to retrieve large files stored in a Space using Git LFS.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`xet\` \| string \| No \| Filter for Xet-specific files. Used for Xet-enabled repositories. \|
\| \`repo\` \| string \| Yes \| The repository name of the Space. \|
\| \`limit\` \| integer \| No \| Maximum number of LFS files to return. Default is 1000. \|
\| \`cursor\` \| string \| No \| Cursor for pagination. Use the cursor returned from a previous request to fetch the next page of results. \|
\| \`namespace\` \| string \| Yes \| The namespace (username or organization) that owns the Space. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Space Paths Info

\*\*Slug:\*\* \`HUGGING\_FACE\_LIST\_SPACES\_PATHS\_INFO\`

Tool to list detailed information about specific paths in a Hugging Face space repository. Use when you need to get metadata about files or directories in a space, including size, type, commit history, and security scan status.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rev\` \| string \| Yes \| Git revision (branch, tag, or commit hash) to query \|
\| \`repo\` \| string \| Yes \| Space repository name \|
\| \`paths\` \| string \| Yes \| List of paths to get information about, or a single path string. Paths are relative to the repository root. \|
\| \`expand\` \| string \| Yes \| Whether to expand the response with last commit and security file status information. Can be a boolean or an object with expansion options. \|
\| \`namespace\` \| string \| Yes \| Namespace (user or organization) that owns the space \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Space References

\*\*Slug:\*\* \`HUGGING\_FACE\_LIST\_SPACES\_REFS\`

Tool to list all references (branches, tags, converts, pull requests) in a Hugging Face space repository. Use when you need to retrieve available references for a specific space.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`repo\` \| string \| Yes \| The repository name of the space. \|
\| \`namespace\` \| string \| Yes \| The namespace (organization or user) that owns the space. \|
\| \`include\_prs\` \| boolean \| No \| Whether to include pull requests in the response. Set to true to include pull requests. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### List Cloud Provider Vendors

\*\*Slug:\*\* \`HUGGING\_FACE\_LIST\_VENDORS\`

Tool to list available cloud provider vendors for Hugging Face Inference Endpoints. Use when you need to discover available infrastructure options across AWS, Azure, and GCP. Returns vendors with their regions and compute instance types for deploying models.

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Search dataset

\*\*Slug:\*\* \`HUGGING\_FACE\_SEARCH\_DATASET\`

Tool to search text in a dataset split on Hugging Face. Searches in columns of type string, even if values are nested in a dictionary. Use when you need to find specific text or patterns within a dataset's content. Returns matching rows with their data.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`query\` \| string \| Yes \| Text to search for in the dataset. Searches in all columns of type string, even if values are nested in a dictionary. \|
\| \`split\` \| string \| Yes \| Name of the dataset split to search. \|
\| \`config\` \| string \| Yes \| Name of the configuration/subset of the dataset to search. \|
\| \`length\` \| integer \| No \| Length of the slice (number of rows to return). Maximum value is 100. Defaults to API default if not specified. \|
\| \`offset\` \| integer \| No \| Offset of the slice for pagination. Specifies the starting position in the results. Defaults to 0 if not specified. \|
\| \`dataset\` \| string \| Yes \| Name of the dataset to search. Use format 'owner/dataset-name' for user datasets or just 'dataset-name' for official datasets. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Search Documentation

\*\*Slug:\*\* \`HUGGING\_FACE\_SEARCH\_DOCS\`

Tool to search Hugging Face documentation across all products and libraries. Use when you need to find information about HF tools, models, datasets, or API usage.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`q\` \| string \| Yes \| Search query string to find relevant documentation pages. Use keywords related to the topic you want to learn about. \|
\| \`limit\` \| integer \| No \| Maximum number of search results to return. Defaults to 10. \|
\| \`offset\` \| integer \| No \| Number of results to skip for pagination. Use with limit to page through results. For example, offset=10 with limit=10 returns results 11-20. \|
\| \`product\` \| string ("hub" \| "transformers" \| "diffusers" \| "datasets" \| "gradio" \| "trackio" \| "smolagents" \| "huggingface\_hub" \| "huggingface.js" \| "transformers.js" \| "inference-providers" \| "inference-endpoints" \| "peft" \| "accelerate" \| "optimum" \| "optimum-habana" \| "optimum-neuron" \| "optimum-intel" \| "optimum-executorch" \| "optimum-tpu" \| "tokenizers" \| "llm-course" \| "robotics-course" \| "mcp-course" \| "smol-course" \| "agents-course" \| "deep-rl-course" \| "computer-vision-course" \| "evaluate" \| "tasks" \| "dataset-viewer" \| "trl" \| "simulate" \| "sagemaker" \| "timm" \| "safetensors" \| "tgi" \| "setfit" \| "audio-course" \| "lerobot" \| "reachy\_mini" \| "autotrain" \| "tei" \| "bitsandbytes" \| "cookbook" \| "sentence\_transformers" \| "ml-games-course" \| "diffusion-course" \| "ml-for-3d-course" \| "chat-ui" \| "leaderboards" \| "lighteval" \| "argilla" \| "distilabel" \| "microsoft-azure" \| "kernels" \| "google-cloud") \| No \| Enum for Hugging Face product types to search documentation. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Search Papers

\*\*Slug:\*\* \`HUGGING\_FACE\_SEARCH\_PAPERS\`

Tool to perform hybrid semantic/full-text search on papers in Hugging Face. Use when you need to find research papers by keywords, topics, or authors.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`q\` \| string \| No \| Search query string to find relevant papers. Use keywords, paper titles, or topics. Supports hybrid semantic and full-text search. \|
\| \`limit\` \| integer \| No \| Maximum number of papers to return. If not specified, the API will use its default limit. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Squash Dataset Commits

\*\*Slug:\*\* \`HUGGING\_FACE\_SQUASH\_DATASET\_COMMITS\`

Tool to squash all commits in a dataset ref into a single commit with the given message. Use when consolidating commit history into a single commit. WARNING: This operation is irreversible.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rev\` \| string \| Yes \| The ref (branch or revision) to squash. This operation is irreversible and will squash all commits in this ref into a single commit. \|
\| \`repo\` \| string \| Yes \| The name of the dataset repository to squash commits in. \|
\| \`message\` \| string \| No \| The commit message for the squashed commit. Maximum length is 500 characters. \|
\| \`namespace\` \| string \| Yes \| The namespace (organization or user) that owns the dataset. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Squash Spaces Commits

\*\*Slug:\*\* \`HUGGING\_FACE\_SQUASH\_SPACES\_COMMITS\`

Tool to squash all commits in a space ref into a single commit with the given message. Use when consolidating commit history into a single commit. WARNING: This operation is irreversible.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`rev\` \| string \| Yes \| The ref (branch or revision) to squash. This operation is irreversible and will squash all commits in this ref into a single commit. Typically 'main' or a branch name. \|
\| \`repo\` \| string \| Yes \| The name of the space repository where commits will be squashed. For example, for space '121tester/test-curl-space', the repo is 'test-curl-space'. \|
\| \`message\` \| string \| No \| The commit message for the squashed commit. Maximum length is 500 characters. If not provided, a default message will be used. \|
\| \`namespace\` \| string \| Yes \| The namespace (username or organization) that owns the space repository. For example, for space '121tester/test-curl-space', the namespace is '121tester'. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Dataset Settings

\*\*Slug:\*\* \`HUGGING\_FACE\_UPDATE\_DATASETS\_SETTINGS\`

Tool to update settings for a Hugging Face dataset repository. Use when you need to configure visibility, discussions, gating, or access control for a dataset.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`repo\` \| string \| Yes \| The name of the dataset repository \|
\| \`gated\` \| string \| No \| Gating configuration for the dataset. Controls access restrictions and gating behavior. Can be a boolean to enable/disable gating, or an object with gating configuration \|
\| \`private\` \| boolean \| No \| Whether the dataset is private. Set to true to make private, false to make public \|
\| \`namespace\` \| string \| Yes \| The namespace (organization or username) that owns the dataset \|
\| \`discussions\_sorting\` \| string ("recently-created" \| "trending" \| "reactions") \| No \| Enum for discussion sorting options. \|
\| \`discussions\_disabled\` \| boolean \| No \| Whether discussions are disabled for this dataset. Set to true to disable discussions, false to enable them \|
\| \`gated\_notifications\_mode\` \| string ("bulk" \| "real-time") \| No \| Enum for gated notification modes. \|
\| \`gated\_notifications\_email\` \| string \| No \| Email address to receive notifications about gated access requests. Must be a valid email format \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Discussion Title

\*\*Slug:\*\* \`HUGGING\_FACE\_UPDATE\_DISCUSSIONS\_TITLE\`

Tool to change the title of an existing discussion on a Hugging Face repository (model, dataset, or Space). Use when you need to update or correct a discussion's title.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`num\` \| string \| Yes \| The discussion number/identifier to update the title for. \|
\| \`repo\` \| string \| Yes \| The name of the repository where the discussion is located. \|
\| \`title\` \| string \| Yes \| The new title for the discussion. Must be between 3 and 200 characters. \|
\| \`namespace\` \| string \| Yes \| The namespace (username or organization) that owns the repository. \|
\| \`repo\_type\` \| string ("models" \| "spaces" \| "datasets") \| Yes \| The type of repository: models, spaces, or datasets. This determines where the discussion is located. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Model Repository Settings

\*\*Slug:\*\* \`HUGGING\_FACE\_UPDATE\_MODELS\_SETTINGS\`

Tool to update settings for a Hugging Face model repository. Use when you need to modify repository configuration such as privacy, discussions, or gated access settings.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`repo\` \| string \| Yes \| The name of the model repository to update settings for. \|
\| \`private\` \| boolean \| No \| Whether the model repository should be private (requires authentication to access) or public. \|
\| \`namespace\` \| string \| Yes \| The namespace (username or organization) that owns the model repository. \|
\| \`discussionsSorting\` \| string ("recently-created" \| "trending" \| "reactions") \| No \| Sorting order for discussions. \|
\| \`discussionsDisabled\` \| boolean \| No \| Whether to disable discussions for this model repository. Set to true to disable, false to enable. \|
\| \`gatedNotificationsMode\` \| string ("bulk" \| "real-time") \| No \| Notification mode for gated access requests. \|
\| \`gatedNotificationsEmail\` \| string \| No \| Email address to receive notifications about gated access requests. Must be a valid email format. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Notification Settings

\*\*Slug:\*\* \`HUGGING\_FACE\_UPDATE\_SETTINGS\_NOTIFICATIONS\`

Tool to update notification settings for the authenticated Hugging Face user. Use when you need to enable or disable various notification types such as announcements, discussions, paper digests, or product updates.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`notifications\` \| object \| Yes \| Notification settings to update. Only include the specific notification preferences you want to change. \|
\| \`prepaidAmount\` \| string \| No \| Prepaid amount to be provided when enabling launch\_prepaid\_credits notification. Maximum length is 24 characters. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Watch Settings

\*\*Slug:\*\* \`HUGGING\_FACE\_UPDATE\_SETTINGS\_WATCH\`

Tool to update watch settings for your Hugging Face account. Use when you want to get notified about discussions on organizations, users, or repositories. You can add new items to watch and/or remove items from your watch list in a single request.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`add\` \| array \| No \| Array of items to start watching. Each item must specify an 'id' and 'type'. You will receive notifications when discussions happen on these items. Leave empty if you only want to remove items from watch list. \|
\| \`delete\` \| array \| No \| Array of items to stop watching. Each item must specify an 'id' and 'type'. You will no longer receive notifications for discussions on these items. Leave empty if you only want to add items to watch list. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Webhook

\*\*Slug:\*\* \`HUGGING\_FACE\_UPDATE\_SETTINGS\_WEBHOOKS\`

Tool to update an existing webhook in Hugging Face settings. Use when you need to modify webhook configuration such as watched entities, event domains, target URL, or job settings.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`job\` \| object \| No \| Model for webhook job configuration to execute when webhook triggers. \|
\| \`url\` \| string \| No \| URL endpoint where webhook POST requests will be sent when events occur. Must be a valid HTTP/HTTPS URL. \|
\| \`secret\` \| string \| No \| Secret string used to sign webhook requests for verification. Must contain only printable ASCII characters. \|
\| \`domains\` \| array \| Yes \| List of event domains that trigger the webhook. At least one domain is required. 'repo' for repository events, 'discussion' for discussion events. \|
\| \`watched\` \| array \| Yes \| List of entities to watch (users, organizations, or repositories). At least one item is required. Events from these entities will trigger the webhook. \|
\| \`webhookId\` \| string \| Yes \| The unique identifier of the webhook to update (24-character hexadecimal string). Get this from the list webhooks action. \|
\| \`jobSourceId\` \| string \| No \| Source identifier for the job. Used to track the origin of the job execution. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update Spaces Repository Settings

\*\*Slug:\*\* \`HUGGING\_FACE\_UPDATE\_SPACES\_SETTINGS\`

Tool to update settings for a Hugging Face Spaces repository. Use when you need to modify repository configuration such as privacy, discussions, or gated access settings.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`repo\` \| string \| Yes \| The name of the Spaces repository to update settings for. \|
\| \`gated\` \| string \| No \| Gating configuration for the Spaces repository. Controls access restrictions and gating behavior. Can be a boolean to enable/disable gating, or an object with gating configuration. \|
\| \`private\` \| boolean \| No \| Whether the Spaces repository should be private (requires authentication to access) or public. \|
\| \`namespace\` \| string \| Yes \| The namespace (username or organization) that owns the Spaces repository. \|
\| \`discussionsSorting\` \| string ("recently-created" \| "trending" \| "reactions") \| No \| Sorting order for discussions. \|
\| \`discussionsDisabled\` \| boolean \| No \| Whether to disable discussions for this Spaces repository. Set to true to disable, false to enable. \|
\| \`gatedNotificationsMode\` \| string ("bulk" \| "real-time") \| No \| Notification mode for gated access requests. \|
\| \`gatedNotificationsEmail\` \| string \| No \| Email address to receive notifications about gated access requests. Must be a valid email format. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Update SQL Console Embed

\*\*Slug:\*\* \`HUGGING\_FACE\_UPDATE\_SQL\_CONSOLE\_EMBED\`

Tool to update an existing SQL console embed for a Hugging Face dataset. Use when you need to modify the SQL query, title, or privacy settings of an existing embed.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`id\` \| string \| Yes \| The slug identifier of the SQL console embed to update (not the \_id). This is returned as 'slug' when creating an embed \|
\| \`sql\` \| string \| No \| The SQL query string to execute in the console embed \|
\| \`repo\` \| string \| Yes \| The name of the dataset repository \|
\| \`title\` \| string \| No \| The title of the SQL console embed. Maximum 200 characters \|
\| \`private\` \| boolean \| No \| Whether the SQL console embed is private. Set to true to make it private, false to make it public \|
\| \`namespace\` \| string \| Yes \| The namespace (username or organization) that owns the dataset repository \|
\| \`repo\_type\` \| string ("datasets") \| Yes \| The type of repository. Currently only 'datasets' is supported \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|

\### Enable or Disable Webhook

\*\*Slug:\*\* \`HUGGING\_FACE\_UPDATE\_WEBHOOK\_STATUS\`

Tool to enable or disable a webhook on Hugging Face. Use when you need to temporarily deactivate a webhook without deleting it, or reactivate a previously disabled webhook.

\#### Input Parameters

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`action\` \| string ("enable" \| "disable") \| Yes \| The action to perform on the webhook: 'enable' to activate the webhook or 'disable' to deactivate it. \|
\| \`webhookId\` \| string \| Yes \| The unique identifier of the webhook to enable or disable. Must be a 24-character hexadecimal string. \|

\#### Output

\| Parameter \| Type \| Required \| Description \|
\|-----------\|------\|----------\|-------------\|
\| \`data\` \| string \| Yes \| Data from the action execution \|
\| \`error\` \| string \| No \| Error if any occurred during the execution of the action \|
\| \`successful\` \| boolean \| Yes \| Whether or not the action execution was successful or not \|
