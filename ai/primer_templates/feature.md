# Instruction Feature Development

## **Purpose**

This template guides the development of new features, ensuring they align with project goals and standards while facilitating effective collaboration.

---

## **Key Principles**

- **Clear Objectives**: Define the feature's purpose and expected outcomes.
- **User-Centric Design**: Consider user experience and accessibility.
- **Preserve Existing Functionality**: Ensure new features do not break existing code.
- **Best Practices**: Follow coding standards and project guidelines.
- **Modular Development**: Build reusable and maintainable components.

---

## **Session Workflow**

### **1. Define Feature Requirements**

- **Feature Description**: Provide a clear and concise description of the feature.
- **User Stories**: Outline scenarios demonstrating how users will interact with the feature.
- **Acceptance Criteria**: List specific conditions that must be met for the feature to be considered complete.
- **Affected Areas**: Identify which parts of the codebase will be involved.

_Example:_

- **Feature Description**: Implement a user profile page where users can view and edit their information.
- **User Stories**:
  1. As a user, I want to view my profile information.
  2. As a user, I want to edit my profile details.
- **Acceptance Criteria**:
  - Users can access the profile page from the navigation menu.
  - Users can see their current profile information.
  - Users can update their name, email, and password.
- **Affected Areas**: `src/pages/ProfilePage.jsx`, `src/components/ProfileForm.jsx`

---

### **2. Confirm Understanding**

- **AI Assistant**: Summarize the feature and confirm understanding.
- **Clarifications**: Ask for additional details if necessary.

---

### **3. Planning and Design**

- **Outline the Implementation Plan**:
  - Break down the feature into smaller tasks.
  - Consider data flow and state management.
  - Design UI components and interactions.
- **Wireframes or Mockups**: Reference any design assets if available.

---

### **4. Implementation**

- **Code Development**:
  - Follow project coding standards.
  - Use appropriate state management techniques.
  - Ensure code is modular and reusable.
- **Annotations**:
  - Add comments for complex logic.
  - Use clear naming conventions.
- **Accessibility**:
  - Implement semantic HTML.
  - Ensure keyboard navigation and screen reader compatibility.

---

### **5. Testing**

- **Unit Tests**: Write tests for individual components and functions.
- **Integration Tests**: Test interactions between components.
- **User Testing**: Simulate user interactions to verify functionality.

---

### **6. Review and Summary**

- **Provide a Summary**: Outline the implemented features and any deviations from the plan.
- **Potential Impacts**: Note any side effects or areas that may require further attention.
- **Await Feedback**: Seek input before finalizing.

---

### **7. Documentation Updates**

- **Update Documentation**: Add or modify documentation to reflect the new feature.
- **User Guides**: Update user-facing documentation if applicable.
- **Version Control**: Prepare commits with descriptive messages.

---

## **Best Practices for Feature Development**

- **Incremental Development**: Implement features in small, manageable increments.
- **Code Reviews**: Encourage peer reviews to maintain code quality.
- **Performance Considerations**: Optimize for performance where necessary.
- **Reusability**: Build components that can be reused in other parts of the application.

---
