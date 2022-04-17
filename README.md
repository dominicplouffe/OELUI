# What is onErrorLog

onErrorLog is a monitoring service for your startup and your side projects.  The source code is created with Python/Django (API) and React (Dashboard/Admin).

## Key Features
- Monitor your cron jobs
- Monitor your pipeline workflows
- Monitor your background jobs and daemons
- Monitor your API uptime
- Monitor your website uptime

## Technolgies and Platforms
- Python 3 
- Django
- Celery
- Postgres
- React

## Project Design
Want to try is out?  Signup for a free account here: https://app.onerrorlog.com.

## Why did you create another Cron and Website monitoring application
It's pretty simple actually.  I wanted to learn React! I always tell the entry level developers that I hire to start creating projects if you want to learn something new, so I preach what I teach.

In many of my personal or professional projects I have needed the ability to monitor REST endpoints or jobs that run at a regular interval.  So this is a common problem that I understand very well... so I decided to create a working version of a tool that I often rely on.

## Project Design
onErrorLog is made of up 2 different projects:

Project | Technology | Description
--------|------------|------------
API | Python 3 / Django / Celery / Postgres | The API, which is located in the api folder is a Django project.  It is a REST API that is used by the Dashboard project.  There are also some tasks that use Celery. https://github.com/dominicplouffe/OEL
Dashboard | React | The Dashboard, which is located in the dasbhoard folder, is a React project.  It is the main UI that the user interacts with. https://github.com/dominicplouffe/OELUI
