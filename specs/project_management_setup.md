# Project Management Setup

## Overview
This document outlines our project management workflow using GitHub Projects and Work Session Objectives documents to structure our development process.

## Current Tools & Documentation
- [GitHub Projects](https://github.com/ychartois/OrienteeringApp/projects) - For task tracking and project management
- [Roadmap](../docs/roadmap.md) - High-level feature and development timeline
- [Branch and Release Strategy](../docs/branch-release-strategy.md) - Git workflow and release process

## Work Session Objectives
We use Work Session Objectives documents to establish clear goals for each development session, improve AI assistance, and keep track of progress. This approach:

1. Creates a clear contract between the developer and AI assistant
2. Maintains focus on specific goals within a timeframe
3. Integrates with GitHub Issues and Projects
4. Documents decisions and learnings

[Template available here](work_session_objectives_template.md)

## GitHub Project Structure
Our GitHub Project board has the following columns:
- **Backlog**: Issues to be addressed in the future
- **Ready for Development**: Issues prioritized for the next work sessions
- **In Progress**: Issues currently being worked on
- **In Review**: Work completed and awaiting review/testing
- **Done**: Completed and merged work

## GitHub Templates
We use standardized templates for consistency:
- **Issues**: Templates for feature requests and bug reports
- **Pull Requests**: Template ensuring proper documentation of changes
- **Work Session Objectives**: Template for planning and tracking development sessions

## Workflow Process

### Starting a Work Session
1. Create a new Work Session Objectives document using the template
2. Link relevant GitHub issues
3. Set clear goals and success criteria
4. Identify questions for AI assistance

### During Development
1. Create feature/bugfix branch following our branch naming convention
2. Reference the GitHub issue in commits (e.g., "#14: Add symbol filtering")
3. Update the Work Session Objectives document with notes and decisions
4. Document any blockers or questions

### Completing Work
1. Submit a pull request using the PR template
2. Complete the session retrospective in the Work Session Objectives document
3. Update GitHub issue status and add relevant comments
4. Plan next steps for future sessions

## GitHub Automation
We utilize GitHub Actions to automate:
- Moving issues to "In Progress" when branches are created
- Moving issues to "In Review" when PRs are submitted
- Moving issues to "Done" when PRs are merged
- Running tests and checks on PRs

## Release Process
1. Create a release branch when features are ready
2. Run final tests and make fixes as needed
3. Generate release notes from PRs and issues
4. Create GitHub release with version tag
5. Deploy to production

## Continuous Improvement
This project management approach is iterative. We regularly review and improve:
- Templates based on team feedback
- Automation workflows
- Documentation clarity
- Process efficiency