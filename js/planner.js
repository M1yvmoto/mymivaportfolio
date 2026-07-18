document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const plannerForm = document.getElementById('planner-form');
    const taskInput = document.getElementById('task-input');
    const taskCategory = document.getElementById('task-category');
    const taskDeadline = document.getElementById('task-deadline');
    
    const pendingList = document.getElementById('pending-list');
    const completedList = document.getElementById('completed-list');
    
    const pendingCount = document.getElementById('pending-count');
    const completedCount = document.getElementById('completed-count');

    // State
    let tasks = [];

    // Load tasks from localStorage
    function loadTasks() {
        const storedTasks = localStorage.getItem('academic_tasks');
        if (storedTasks) {
            try {
                tasks = JSON.parse(storedTasks);
            } catch (e) {
                console.error("Error parsing tasks from local storage", e);
                tasks = [];
            }
        } else {
            // Initial Seed Tasks for Demo
            tasks = [
                {
                    id: '1',
                    text: 'Finish COS 106 Web Portfolio Project',
                    category: 'project',
                    deadline: '2026-07-25',
                    completed: false
                },
                {
                    id: '2',
                    text: 'Study for COS 101 Midterm Exams',
                    category: 'study',
                    deadline: '2026-07-20',
                    completed: false
                },
                {
                    id: '3',
                    text: 'Submit Introduction to Computer Science Assignment',
                    category: 'assignment',
                    deadline: '2026-07-15',
                    completed: true
                }
            ];
            saveTasks();
        }
        renderTasks();
    }

    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('academic_tasks', JSON.stringify(tasks));
    }

    // Render all tasks
    function renderTasks() {
        // Clear lists
        pendingList.innerHTML = '';
        completedList.innerHTML = '';

        let pending = 0;
        let completed = 0;

        tasks.forEach(task => {
            const taskEl = createTaskDOMElement(task);
            if (task.completed) {
                completedList.appendChild(taskEl);
                completed++;
            } else {
                pendingList.appendChild(taskEl);
                pending++;
            }
        });

        // Update counts
        pendingCount.textContent = pending;
        completedCount.textContent = completed;

        // Show empty states if necessary
        toggleEmptyStates(pending, completed);
    }

    // Toggle empty list visual guidelines
    function toggleEmptyStates(pending, completed) {
        if (pending === 0) {
            pendingList.innerHTML = `
                <div class="empty-tasks">
                    <p>All caught up! No pending tasks.</p>
                </div>
            `;
        }
        if (completed === 0) {
            completedList.innerHTML = `
                <div class="empty-tasks">
                    <p>No completed tasks yet. Keep moving forward!</p>
                </div>
            `;
        }
    }

    // Create a single Task DOM Node
    function createTaskDOMElement(task) {
        const item = document.createElement('div');
        item.className = 'task-item';
        item.dataset.id = task.id;

        // Format Date
        let formattedDate = 'No deadline';
        if (task.deadline) {
            const dateObj = new Date(task.deadline);
            if (!isNaN(dateObj.getTime())) {
                formattedDate = dateObj.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                });
            }
        }

        // Category icons mapping
        const categoryLabels = {
            assignment: 'Assignment',
            study: 'Study',
            exam: 'Exam',
            project: 'Project'
        };

        item.innerHTML = `
            <div class="task-left">
                <div class="task-checkbox-wrapper">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                    <span class="task-checkbox-custom"></span>
                </div>
                <div class="task-details">
                    <span class="task-text">${escapeHTML(task.text)}</span>
                    <div class="task-meta">
                        <span class="task-category ${task.category}">${categoryLabels[task.category] || task.category}</span>
                        <span class="task-date">
                            Deadline: ${formattedDate}
                        </span>
                    </div>
                </div>
            </div>
            <div class="task-actions">
                <button class="delete-task-btn flex-center" title="Delete Task" aria-label="Delete task" style="padding: 0.4rem; background: none; border: none; color: var(--text-muted); cursor: pointer; transition: var(--transition-smooth);">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
            </div>
        `;

        // Checkbox toggle listener
        const checkbox = item.querySelector('.task-checkbox');
        checkbox.addEventListener('change', () => {
            toggleTaskComplete(task.id);
        });

        // Delete button click listener
        const deleteBtn = item.querySelector('.delete-task-btn');
        deleteBtn.addEventListener('click', () => {
            // Add visual fade out animation before actual removal
            item.style.opacity = '0';
            item.style.transform = 'translateY(10px)';
            item.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                deleteTask(task.id);
            }, 300);
        });

        return item;
    }

    // Add Task
    if (plannerForm) {
        plannerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const text = taskInput.value.trim();
            const category = taskCategory.value;
            const deadline = taskDeadline.value;

            if (!text) return;

            const newTask = {
                id: Date.now().toString(),
                text: text,
                category: category,
                deadline: deadline,
                completed: false
            };

            tasks.push(newTask);
            saveTasks();
            renderTasks();

            // Reset form
            taskInput.value = '';
            taskDeadline.value = '';
        });
    }

    // Toggle Complete State
    function toggleTaskComplete(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        saveTasks();
        renderTasks();
    }

    // Delete Task
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }

    // Helper: Escape user input to prevent XSS
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    // Initialize
    loadTasks();
});
