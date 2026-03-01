pipeline {
    agent any

    environment {
        REGISTRY = "ghcr.io"
        GITHUB_USER = "ajedhe1998"
        IMAGE_BACKEND = "ghcr.io/ajedhe1998/ai-chat-backend"
        IMAGE_FRONTEND = "ghcr.io/ajedhe1998/ai-chat-frontend"
        TAG = "latest"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend Image') {
            steps {
                sh '''
                docker build -t $IMAGE_BACKEND:$TAG ./backend
                '''
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh '''
                docker build -t $IMAGE_FRONTEND:$TAG ./frontend
                '''
            }
        }

        stage('Login to GHCR') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'ajedhe1998',
                    usernameVariable: 'GITHUB_USER',
                    passwordVariable: 'GITHUB_TOKEN'
                )]) {
                    sh '''
                    echo $GH_TOKEN | docker login $REGISTRY -u $GH_USER --password-stdin
                    '''
                }
            }
        }

        stage('Push Images to GHCR') {
            steps {
                sh '''
                docker push $IMAGE_BACKEND:$TAG
                docker push $IMAGE_FRONTEND:$TAG
                '''
            }
        }

        stage('Cleanup') {
            steps {
                sh '''
                docker system prune -f
                '''
            }
        }
    }

    post {
        success {
            echo "Images successfully built and pushed to GHCR 🚀"
        }
        failure {
            echo "Pipeline failed ❌"
        }
    }
}