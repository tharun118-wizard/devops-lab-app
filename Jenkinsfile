pipeline {

  agent any

  environment {
    APP_NAME      = 'devops-lab-app'
    DOCKER_IMAGE  = "${APP_NAME}:${BUILD_NUMBER}"
    CONTAINER_NAME= 'devops-app-container'
    APP_PORT      = '3000'
  }

  tools {
    nodejs 'NodeJS-18'
  }

  stages {

    // ── STAGE 1: Checkout ────────────────────────
    stage('📁 Checkout') {
      steps {
        echo "Checking out branch: ${env.GIT_BRANCH}"
        checkout scm
        sh 'ls -la && echo "--- Repository contents ---"'
      }
    }

    // ── STAGE 2: Install Dependencies ────────────
    stage('📦 Install Dependencies') {
      steps {
        sh '''
          echo "Node version: $(node --version)"
          echo "NPM version:  $(npm --version)"
          npm ci
        '''
      }
    }

    // ── STAGE 3: Run Tests ───────────────────────
    stage('🧪 Run Tests') {
      steps {
        sh 'npm test -- --coverage'
      }
      post {
        always {
          // Publish test results if junit reporter is configured
          echo 'Tests completed.'
        }
        failure {
          echo '❌ Tests FAILED. Pipeline will not proceed to deploy.'
        }
      }
    }

    // ── STAGE 4: Build Docker Image ──────────────
    stage('🐳 Build Docker Image') {
      steps {
        sh """
          docker build \
            --build-arg BUILD_NUMBER=${BUILD_NUMBER} \
            -t ${DOCKER_IMAGE} \
            -t ${APP_NAME}:latest \
            .
          echo "Image built: ${DOCKER_IMAGE}"
          docker images | grep ${APP_NAME}
        """
      }
    }

    // ── STAGE 5: Deploy Container ────────────────
    stage('🚀 Deploy') {
      steps {
        sh """
          // Stop & remove old container if it exists
          docker stop ${CONTAINER_NAME} || true
          docker rm   ${CONTAINER_NAME} || true

          // Run new container
          docker run -d \
            --name ${CONTAINER_NAME} \
            -p ${APP_PORT}:3000 \
            -e BUILD_NUMBER=${BUILD_NUMBER} \
            --restart unless-stopped \
            ${DOCKER_IMAGE}

          echo "Deployed at: http://localhost:${APP_PORT}"
        """
      }
    }

    // ── STAGE 6: Health Check ────────────────────
    stage('💚 Health Check') {
      steps {
        sh """
          echo "Waiting 5s for app to start..."
          sleep 5
          curl -f http://localhost:${APP_PORT}/health \
            && echo "✅ App is healthy!" \
            || (echo "❌ Health check failed!" && exit 1)
        """
      }
    }

  }

  post {
    success {
      echo """
        ✅ PIPELINE SUCCEEDED
        App : ${APP_NAME}
        Build: #${BUILD_NUMBER}
        URL  : http://localhost:${APP_PORT}
      """
    }
    failure {
      echo '❌ PIPELINE FAILED — check console output above.'
    }
    always {
      sh 'docker image prune -f || true'
    }
  }

}
