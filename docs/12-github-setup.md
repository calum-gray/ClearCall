# GitHub setup for the group

This project is ready to push to a shared GitHub repo.

## Create the repo

1. One person creates an empty GitHub repository (private is fine).
2. Do **not** tick “Add a README” if you are pushing this existing project, or you will get a merge conflict on first push.
3. Add everyone else as collaborators (Settings → Collaborators).

## First push

From the project root on your machine:

```bash
git remote -v
# if origin is wrong / old:
git remote remove origin

git remote add origin https://github.com/YOUR_USER_OR_ORG/REPO_NAME.git
git push -u origin main
```

If GitHub asks you to auth, use a Personal Access Token or GitHub CLI (`gh auth login`).

## Day-to-day

```bash
git pull origin main
# make changes
git add .
git commit -m "Short description of what you changed"
git push
```

Optional: use feature branches (`feature/your-initials-topic`) and open a pull request into `main` so we can review each other’s work. A PR is optional for GitHub — it is separate from the Bitbucket PR process some of us use at work.

## Canvas zip

Before hand-in:

```bash
npm run gitlog
```

Include `git-log.txt` in the zip with the rest of the project, as the brief asks for evidence of version control.
