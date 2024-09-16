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

## **Best Practices for Debugging new features**

- **Use Debugging Tools**: Leverage tools like `console.log`, breakpoints, or `createEffect` in Solid.js.
- **Isolate the Issue**: Reproduce the bug in a controlled environment.
- **Error Handling**: Implement proper error handling and messaging.
- **Collaborate**: Communicate any uncertainties or findings.
- **Additional Debugging Tips**:

  - Follow these tips and examples to debug your code:
  - Use createEffect for debugging reactive state changes
    When to use: Use createEffect when you need to track changes in reactive state and perform side effects or logging based on those changes.
    Why: It helps you understand when and how your reactive state is changing, which can be crucial for debugging complex reactive flows.
    Example:

    ```
    import { createSignal, createEffect } from "solid-js";

    function ShoppingCart() {
      const [items, setItems] = createSignal([]);
      const [total, setTotal] = createSignal(0);

      createEffect(() => {
        console.log("Items in cart:", items());
        console.log("Total price:", total());
      });

      const addItem = (item) => {
        setItems([...items(), item]);
        setTotal(total() + item.price);
      };

      return (
        <div>
          <button onClick={() => addItem({ name: "Product", price: 9.99 })}>
            Add Item
          </button>
          <p>Total: ${total().toFixed(2)}</p>
        </div>
      );
    }
    ```

    In this example, createEffect is used to log changes to the shopping cart. Every time an item is added, you'll see console logs showing the updated cart contents and total price. This is helpful for tracking the state of your shopping cart and ensuring that items and totals are being calculated correctly.

  - Leverage createMemo for debugging computed values
    When to use: Use createMemo when you have expensive computations that depend on reactive state, and you want to debug when and how often these computations are being performed.
    Why: It helps optimize performance by caching computed values and allows you to track when recomputations occur.
    Example:

    ```
    import { createSignal, createMemo } from "solid-js";

    function GradeCalculator() {
      const [assignments, setAssignments] = createSignal([]);
      const [exams, setExams] = createSignal([]);

      const averageGrade = createMemo(() => {
        console.log("Calculating average grade");
        const allGrades = [...assignments(), ...exams()];
        return allGrades.reduce((sum, grade) => sum + grade, 0) / allGrades.length || 0;
      });

      const addAssignment = (grade) => setAssignments([...assignments(), grade]);
      const addExam = (grade) => setExams([...exams(), grade]);

      return (
        <div>
          <button onClick={() => addAssignment(85)}>Add Assignment</button>
          <button onClick={() => addExam(90)}>Add Exam</button>
          <p>Average Grade: {averageGrade().toFixed(2)}</p>
        </div>
      );
    }
    ```

    In this example, createMemo is used to calculate the average grade. The console log inside the memo will only run when assignments or exams change, not on every render. This helps you debug when the average is being recalculated and ensures it's not happening unnecessarily.

  - Use error boundaries for catching and debugging errors
    When to use: Use error boundaries when you want to gracefully handle errors in your application and prevent the entire UI from crashing due to an error in a component.
    Why: It allows you to catch and log errors, display fallback UIs, and potentially recover from errors without breaking the entire application.
    Example:

    ```
    import { ErrorBoundary } from "solid-js";

    function BuggyComponent() {
      throw new Error("Oops, something went wrong!");
      return <div>This won't render</div>;
    }

    function App() {
      return (
        <ErrorBoundary fallback={(err) => <div>Error: {err.toString()}</div>}>
          <BuggyComponent />
        </ErrorBoundary>
      );
    }
    ```

    In this example, BuggyComponent always throws an error. Without an error boundary, this would crash the entire application. With the error boundary, the error is caught, and a fallback UI is displayed instead. This is crucial for debugging issues in specific components without breaking the entire app.

  - Utilize untrack to debug dependency tracking
    When to use: Use untrack when you want to access a signal's value within an effect or memo without creating a dependency on that signal.
    Why: It helps you understand and control the reactivity flow in your application, which can be crucial for debugging unexpected re-renders or effect triggers.
    Example:

    ```
    import { createSignal, createEffect, untrack } from "solid-js";

    function DebugReactivity() {
      const [count, setCount] = createSignal(0);
      const [name, setName] = createSignal("John");

      createEffect(() => {
        console.log("Name (tracked):", name());
        console.log("Count (untracked):", untrack(count));
      });

      return (
        <div>
          <button onClick={() => setCount(c => c + 1)}>Increment Count</button>
          <button onClick={() => setName(n => n === "John" ? "Jane" : "John")}>Toggle Name</button>
        </div>
      );
    }
    ```

    In this example, the effect will only re-run when name changes, not when count changes. This helps you debug which state changes are triggering effects and which aren't.

  - Use batch for debugging multiple updates
    When to use: Use batch when you're making multiple state updates that you want to happen together, and you want to debug the combined effect of these updates.
    Why: It helps optimize performance by reducing the number of re-renders and allows you to debug the cumulative effect of multiple state changes.
    Example:

    ```
    import { batch, createSignal } from "solid-js";

    function UserProfile() {
      const [name, setName] = createSignal("John");
      const [age, setAge] = createSignal(30);
      const [email, setEmail] = createSignal("john@example.com");

      const updateProfile = () => {
        console.log("Updating profile...");
        batch(() => {
          setName("Jane");
          setAge(31);
          setEmail("jane@example.com");
          console.log("Profile updated");
        });
      };

      return (
        <div>
          <p>Name: {name()}, Age: {age()}, Email: {email()}</p>
          <button onClick={updateProfile}>Update Profile</button>
        </div>
      );
    }
    ```

    In this example, batch is used to update multiple pieces of state at once. This ensures that the component only re-renders once after all updates are complete, which can be helpful for debugging performance issues and ensuring that all state updates are applied together.

  - Implement custom event logging
    When to use: Use custom event logging when you need to debug user interactions or track the flow of events in your application.
    Why: It provides insight into how users are interacting with your application and helps you trace the sequence of events leading to a particular state or behavior.
    Example:

    ```
    import { createSignal } from "solid-js";

    function DebugForm() {
      const [formData, setFormData] = createSignal({ name: "", email: "" });

      const logEvent = (name) => (e) => {
        console.log(`Event: ${name}`, {
          target: e.target.name,
          value: e.target.value,
          timestamp: new Date().toISOString()
        });
        setFormData({ ...formData(), [e.target.name]: e.target.value });
      };

      return (
        <form>
          <input
            type="text"
            name="name"
            value={formData().name}
            onInput={logEvent("input")}
            onFocus={logEvent("focus")}
            onBlur={logEvent("blur")}
          />
          <input
            type="email"
            name="email"
            value={formData().email}
            onInput={logEvent("input")}
            onFocus={logEvent("focus")}
            onBlur={logEvent("blur")}
          />
        </form>
      );
    }
    ```

    This example logs various events (input, focus, blur) on form fields. This can help you debug issues related to user input, form validation, or event handling by providing a detailed log of user interactions.

  - Use on for targeted effect debugging
    When to use: Use on when you want to debug effects that should only run in response to specific state changes, not all reactive state in the effect.
    Why: It helps you isolate and debug the impact of specific state changes on your application's behavior.
    Example:

    ```
    import { createSignal, createEffect, on } from "solid-js";

    function InventoryTracker() {
      const [stock, setStock] = createSignal(100);
      const [orders, setOrders] = createSignal(0);

      createEffect(on(stock, (newStock, oldStock) => {
        console.log(`Stock changed from ${oldStock} to ${newStock}`);
        if (newStock < 20) {
          console.log("Low stock alert!");
        }
      }));

      createEffect(on(orders, (newOrders) => {
        console.log(`New order received. Total orders: ${newOrders}`);
        setStock(s => s - 1);
      }));

      return (
        <div>
          <p>Current Stock: {stock()}</p>
          <p>Total Orders: {orders()}</p>
          <button onClick={() => setOrders(o => o + 1)}>Place Order</button>
        </div>
      );
    }
    ```

    In this example, we use on to create targeted effects for debugging stock levels and order processing. This allows you to isolate and debug the logic related to stock changes and order processing separately.

  - Leverage createRenderEffect for render-specific debugging
    When to use: Use createRenderEffect when you need to debug operations that should happen synchronously after every render, such as DOM measurements or third-party library integrations.
    Why: It helps you debug issues related to the timing of DOM updates and ensure that certain operations always happen immediately after a render.
    Example:

    ```
    import { createSignal, createRenderEffect } from "solid-js";

    function ResizableBox() {
      const [size, setSize] = createSignal(100);
      let boxRef;

      createRenderEffect(() => {
        if (boxRef) {
          console.log("Box rendered. New dimensions:", {
            width: boxRef.offsetWidth,
            height: boxRef.offsetHeight
          });
        }
      });

      return (
        <div>
          <div
            ref={boxRef}
            style={{ width: `${size()}px`, height: `${size()}px`, background: 'red' }}
          ></div>
          <button onClick={() => setSize(s => s + 10)}>Increase Size</button>
        </div>
      );
    }
    ```

    In this example, createRenderEffect is used to log the dimensions of a box after every render. This is useful for debugging layout issues or ensuring that DOM measurements are always up-to-date with the latest render.

  - Use DEV.useTransition for debugging transitions (in development mode)
    When to use: Use DEV.useTransition when you need to debug the different states of a transition, such as loading states in data fetching scenarios.
    Why: It provides insight into the different phases of a transition, which can be crucial for debugging loading states, error states, and the timing of UI updates.
    Example:

    ```
    import { createSignal, Suspense, createResource } from "solid-js";
    import { DEV } from "solid-js/web";

    const fetchData = () => new Promise(resolve => setTimeout(() => resolve("Data loaded"), 2000));

    function DataLoader() {
      const [data, { refetch }] = createResource(fetchData);

      DEV.useTransition(() => (
        <Suspense fallback={<div>Loading...</div>}>
          <div>{data() || "No data"}</div>
        </Suspense>
      ));

      return <button onClick={refetch}>Reload Data</button>;
    }
    ```

    This example uses DEV.useTransition to debug the loading states of a data fetching operation. In development mode, it will log the different phases of the transition (pending, resolved, rejected), helping you debug issues related to loading states and data fetching.

  - Utilize context for debugging deeply nested components
    When to use: Use context for debugging when you need to provide debugging utilities or flags to deeply nested components without prop drilling.
    Why: It allows you to centralize debugging logic and easily toggle debug modes across your entire application or specific component trees.
    Example:

    ```
    import { createContext, useContext, createSignal } from "solid-js";

    const DebugContext = createContext();

    function DebugProvider(props) {
      const [debugMode, setDebugMode] = createSignal(false);
      const debug = (message) => {
        if (debugMode()) console.log("Debug:", message);
      };

      return (
        <DebugContext.Provider value={{ debug, setDebugMode }}>
          {props.children}
        </DebugContext.Provider>
      );
    }

    function DeepNestedComponent() {
      const { debug } = useContext(DebugContext);
      debug("DeepNestedComponent rendered");
      return <div>Deep Nested Component</div>;
    }

    function DebugToggle() {
      const { setDebugMode } = useContext(DebugContext);
      return <button onClick={() => setDebugMode(d => !d)}>Toggle Debug Mode</button>;
    }

    function App() {
      return (
        <DebugProvider>
          <DebugToggle />
          <DeepNestedComponent />
        </DebugProvider>
      );
    }
    ```

    In this example, a debug context is used to provide a centralized way to toggle debug mode and log debug messages. This is particularly useful for debugging issues in deeply nested components without having to pass debug flags through multiple levels of props.
