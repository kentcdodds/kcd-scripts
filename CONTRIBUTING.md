# Contributing

Thanks for being willing to contribute!

**Working on your first Pull Request?** You can learn how from this _free_ series
[How to Contribute to an Open Source Project on GitHub][egghead]

## Project setup

1.  Fork and clone the repo
2.  `$ npm install` to install dependencies
3.  `$ npm run validate` to validate you've got it working
4.  Create a branch for your PR

> Tip: Keep your `master` branch pointing at the original repository and make
> pull requests from branches on your fork. To do this, run:
>
> ```
> git remote add upstream https://github.com/kentcdodds/kcd-scripts.git
> git fetch upstream
> git branch --set-upstream-to=upstream/master master
> ```
>
> This will add the original repository as a "remote" called "upstream,"
> Then fetch the git information from that remote, then set your local `master`
> branch to use the upstream master branch whenever you run `git pull`.
> Then you can make all of your pull request branches based on this `master`
> branch. Whenever you want to update your version of `master`, do a regular
> `git pull`.

## Committing and Pushing changes

This project uses [`semantic-release`][semantic-release] to do automatic
releases and generate a changelog based on the commit history. So we follow
[a convention][convention] for commit messages. You don't have to follow this
convention if you don't want to. Just know that when we merge your commit, we'll
probably use "Squash and Merge" so we can change the commit message :)

Please make sure to run the tests before you commit your changes. You can run
`npm run test:update` which will update any snapshots that need updating.
Make sure to include those changes (if they exist) in your commit.

### opt in/out of git hooks

There are git hooks set up with this project that are automatically installed
when you install dependencies. They're really handy, but are turned off by
default (so as to not hinder new contributors). You can opt into these by
creating a file called `.opt-in` at the root of the project and putting this
inside:

```
pre-commit
```

One of the things that the git hooks does is automatically format the files you
change. It does this by reformating the entire file and running `git add` on
the file after. This breaks workflows where you're trying to commit portions of
the file only. You can always run your commit with `--no-verify`, but if this
is a bummer to your workflow, you can add an `.opt-out` file with the contents:

```
autoformat
```

## Help needed

Please checkout the [the open issues][issues]

Also, please watch the repo and respond to questions/bug reports/feature
requests! Thanks!

[egghead]: https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github
[semantic-release]: https://npmjs.com/package/semantic-release
[convention]: https://github.com/conventional-changelog/conventional-changelog-angular/blob/ed32559941719a130bb0327f886d6a32a8cbc2ba/convention.md
[issues]: https://github.com/kentcdodds/kcd-scripts/issues
