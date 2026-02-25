// Quiz mock data

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export const mockQuizzes: Record<string, QuizQuestion[]> = {
  c1: [
    { id: "q1", question: "Which algorithm is used for classification tasks?", options: ["Linear Regression", "Logistic Regression", "K-Means", "PCA"], correctIndex: 1 },
    { id: "q2", question: "What does 'overfitting' mean?", options: ["Model performs well on test data", "Model memorizes training data", "Model is too simple", "Model has low bias"], correctIndex: 1 },
    { id: "q3", question: "Random Forest is an example of?", options: ["Boosting", "Bagging", "Stacking", "Blending"], correctIndex: 1 },
    { id: "q4", question: "What is the purpose of cross-validation?", options: ["Increase training speed", "Reduce model size", "Estimate model performance", "Generate more data"], correctIndex: 2 },
    { id: "q5", question: "Which metric is best for imbalanced datasets?", options: ["Accuracy", "F1-Score", "MSE", "R-squared"], correctIndex: 1 },
    { id: "q6", question: "What is gradient descent used for?", options: ["Feature selection", "Data preprocessing", "Optimizing model parameters", "Data visualization"], correctIndex: 2 },
    { id: "q7", question: "SVM stands for?", options: ["Simple Vector Machine", "Support Vector Machine", "Standard Vector Model", "Super Vector Method"], correctIndex: 1 },
    { id: "q8", question: "Which is NOT a type of ML?", options: ["Supervised", "Unsupervised", "Reinforcement", "Procedural"], correctIndex: 3 },
    { id: "q9", question: "K-Means is a type of?", options: ["Classification", "Regression", "Clustering", "Dimensionality Reduction"], correctIndex: 2 },
    { id: "q10", question: "What is a confusion matrix?", options: ["A random data structure", "A table showing prediction results", "A neural network layer", "A data augmentation technique"], correctIndex: 1 },
  ],
  c6: [
    { id: "q1", question: "What hook manages state in React?", options: ["useEffect", "useState", "useRef", "useMemo"], correctIndex: 1 },
    { id: "q2", question: "JSX stands for?", options: ["JavaScript XML", "Java Syntax Extension", "JSON XML", "JavaScript XHR"], correctIndex: 0 },
    { id: "q3", question: "Which hook runs side effects?", options: ["useState", "useCallback", "useEffect", "useContext"], correctIndex: 2 },
    { id: "q4", question: "What is the virtual DOM?", options: ["A backup DOM", "A lightweight copy of the real DOM", "A database", "A CSS framework"], correctIndex: 1 },
    { id: "q5", question: "Props are?", options: ["Mutable", "Immutable", "Only strings", "Only numbers"], correctIndex: 1 },
    { id: "q6", question: "useRef returns?", options: ["A state value", "A mutable ref object", "A callback", "A context"], correctIndex: 1 },
    { id: "q7", question: "React Router v6 uses which component for routes?", options: ["Switch", "Routes", "Router", "Path"], correctIndex: 1 },
    { id: "q8", question: "What is React.memo used for?", options: ["State management", "Preventing unnecessary re-renders", "Routing", "API calls"], correctIndex: 1 },
    { id: "q9", question: "Context API is used for?", options: ["Routing", "State management across components", "Styling", "Testing"], correctIndex: 1 },
    { id: "q10", question: "What does 'key' prop do in lists?", options: ["Adds styling", "Helps React identify elements", "Creates events", "Fetches data"], correctIndex: 1 },
  ],
  c3: [
    { id: "q1", question: "What is AWS S3 used for?", options: ["Compute", "Object storage", "Networking", "Database"], correctIndex: 1 },
    { id: "q2", question: "EC2 stands for?", options: ["Elastic Cloud Computing", "Elastic Compute Cloud", "Enterprise Cloud Center", "Easy Compute Cloud"], correctIndex: 1 },
    { id: "q3", question: "What is IAM?", options: ["Internet Access Manager", "Identity and Access Management", "Internal Application Monitor", "Infrastructure as Model"], correctIndex: 1 },
    { id: "q4", question: "Which service is serverless compute?", options: ["EC2", "Lambda", "RDS", "VPC"], correctIndex: 1 },
    { id: "q5", question: "VPC stands for?", options: ["Virtual Private Cloud", "Virtual Public Cluster", "Variable Processing Container", "Virtual Protocol Center"], correctIndex: 0 },
    { id: "q6", question: "What is CloudFront?", options: ["Database", "CDN", "Compute engine", "Storage"], correctIndex: 1 },
    { id: "q7", question: "RDS is a managed?", options: ["Compute service", "Database service", "Storage service", "Network service"], correctIndex: 1 },
    { id: "q8", question: "Which is a NoSQL database on AWS?", options: ["RDS", "Aurora", "DynamoDB", "Redshift"], correctIndex: 2 },
    { id: "q9", question: "What is the shared responsibility model?", options: ["AWS manages everything", "Customer manages everything", "Shared security responsibilities", "Only for enterprise"], correctIndex: 2 },
    { id: "q10", question: "What is an AWS Region?", options: ["A data center", "A geographic area with multiple AZs", "A single server", "A software tool"], correctIndex: 1 },
  ],
};

// Provide a default quiz for courses without custom questions
export const getQuizForCourse = (courseId: string): QuizQuestion[] => {
  return mockQuizzes[courseId] || mockQuizzes["c1"];
};
