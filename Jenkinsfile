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
                    echo $GITHUB_TOKEN | docker login $REGISTRY -u $GITHUB_USER --password-stdin
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

        stage('Deploy to EC2') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ubuntu@ec2-3-227-20-198.compute-1.amazonaws.com << EOF

                    docker login ghcr.io -u $GITHUB_USER -p $GITHUB_TOKEN

                    docker pull ghcr.io/ajedhe1998/ai-chat-backend:latest
                    docker pull ghcr.io/ajedhe1998/ai-chat-frontend:latest

                    docker stop backend || true
                    docker rm backend || true

                    docker stop frontend || true
                    docker rm frontend || true

                    docker run -d -p 8000:8000 --name backend ghcr.io/ajedhe1998/ai-chat-backend:latest
                    docker run -d -p 3000:3000 --name frontend ghcr.io/ajedhe1998/ai-chat-frontend:latest

                    EOF
                    """
                }
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