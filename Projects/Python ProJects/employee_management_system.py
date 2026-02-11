import customtkinter as ctk
from tkinter import ttk, messagebox
import json
import os

class EmployeeEntryForm:
    def __init__(self):
        ctk.set_appearance_mode("dark")
        ctk.set_default_color_theme("blue")
        
        self.root = ctk.CTk()
        self.root.title("Employee Management System")
        self.root.geometry("700x600")
        self.root.resizable(False, False)
        
        self.employees = []
        self.current_employee_index = -1
        self.data_file = "employees.json"
        
        self.load_data()
        self.create_widgets()
        
    def create_widgets(self):
        main_frame = ctk.CTkFrame(self.root, corner_radius=20)
        main_frame.pack(fill="both", expand=True, padx=15, pady=15)
        
        title_label = ctk.CTkLabel(
            main_frame, 
            text="Employee Management System", 
            font=ctk.CTkFont(size=24, weight="bold")
        )
        title_label.pack(pady=15)
        
        form_frame = ctk.CTkFrame(main_frame, corner_radius=15)
        form_frame.pack(fill="both", expand=True, padx=15, pady=(0, 15))
        
        fields_frame = ctk.CTkFrame(form_frame, fg_color="transparent")
        fields_frame.pack(fill="x", padx=15, pady=15)
        
        left_column = ctk.CTkFrame(fields_frame, fg_color="transparent")
        left_column.pack(side="left", fill="both", expand=True, padx=(0, 10))
        
        right_column = ctk.CTkFrame(fields_frame, fg_color="transparent")
        right_column.pack(side="right", fill="both", expand=True, padx=(10, 0))
        
        ctk.CTkLabel(left_column, text="Name:", font=ctk.CTkFont(size=12, weight="bold")).pack(anchor="w")
        self.name_entry = ctk.CTkEntry(left_column, placeholder_text="Enter name", height=30, width=200)
        self.name_entry.pack(fill="x", pady=(3, 10))
        
        ctk.CTkLabel(left_column, text="Age:", font=ctk.CTkFont(size=12, weight="bold")).pack(anchor="w")
        self.age_entry = ctk.CTkEntry(left_column, placeholder_text="Enter age", height=30, width=200)
        self.age_entry.pack(fill="x", pady=(3, 10))
        
        ctk.CTkLabel(left_column, text="Gender:", font=ctk.CTkFont(size=12, weight="bold")).pack(anchor="w")
        gender_radio_frame = ctk.CTkFrame(left_column, fg_color="transparent")
        gender_radio_frame.pack(fill="x", pady=(3, 10))
        
        self.gender_var = ctk.StringVar(value="Male")
        
        self.male_radio = ctk.CTkRadioButton(gender_radio_frame, text="Male", variable=self.gender_var, value="Male", font=ctk.CTkFont(size=10))
        self.male_radio.pack(side="left", padx=(0, 5))
        
        self.female_radio = ctk.CTkRadioButton(gender_radio_frame, text="Female", variable=self.gender_var, value="Female", font=ctk.CTkFont(size=10))
        self.female_radio.pack(side="left", padx=(0, 5))
        
        self.other_radio = ctk.CTkRadioButton(gender_radio_frame, text="Other", variable=self.gender_var, value="Other", font=ctk.CTkFont(size=10))
        self.other_radio.pack(side="left")
        
        ctk.CTkLabel(right_column, text="Salary:", font=ctk.CTkFont(size=12, weight="bold")).pack(anchor="w")
        self.salary_entry = ctk.CTkEntry(right_column, placeholder_text="Enter salary", height=30, width=200)
        self.salary_entry.pack(fill="x", pady=(3, 10))
        
        ctk.CTkLabel(right_column, text="Position:", font=ctk.CTkFont(size=12, weight="bold")).pack(anchor="w")
        self.position_entry = ctk.CTkEntry(right_column, placeholder_text="Enter position", height=30, width=200)
        self.position_entry.pack(fill="x", pady=(3, 10))
        
        ctk.CTkLabel(right_column, text="Country:", font=ctk.CTkFont(size=12, weight="bold")).pack(anchor="w")
        self.country_combo = ctk.CTkComboBox(
            right_column,
            values=["United States", "United Kingdom", "Canada", "Australia"],
            height=30,
            width=200
        )
        self.country_combo.pack(fill="x", pady=(3, 10))
        self.country_combo.set("United States")
        
        button_frame = ctk.CTkFrame(form_frame, fg_color="transparent")
        button_frame.pack(fill="x", padx=15, pady=(0, 15))
        
        self.save_button = ctk.CTkButton(
            button_frame,
            text="Save",
            command=self.save_employee,
            height=35,
            width=100,
            font=ctk.CTkFont(size=12, weight="bold"),
            fg_color="#2fa572",
            hover_color="#106A43"
        )
        self.save_button.pack(side="left", padx=(0, 8))
        
        self.update_button = ctk.CTkButton(
            button_frame,
            text="Update",
            command=self.update_employee,
            height=35,
            width=100,
            font=ctk.CTkFont(size=12, weight="bold"),
            fg_color="#ff6b35",
            hover_color="#e55a2b"
        )
        self.update_button.pack(side="left", padx=(0, 8))
        
        self.clear_button = ctk.CTkButton(
            button_frame,
            text="Clear",
            command=self.clear_form,
            height=35,
            width=100,
            font=ctk.CTkFont(size=12, weight="bold"),
            fg_color="#636363",
            hover_color="#525252"
        )
        self.clear_button.pack(side="left")
        
        list_frame = ctk.CTkFrame(form_frame, fg_color="transparent")
        list_frame.pack(fill="both", expand=True, padx=15, pady=(0, 15))
        
        ctk.CTkLabel(list_frame, text="Employee List:", font=ctk.CTkFont(size=12, weight="bold")).pack(anchor="w")
        
        self.employee_listbox = ctk.CTkTextbox(list_frame, height=120, font=ctk.CTkFont(size=10))
        self.employee_listbox.pack(fill="both", expand=True, pady=(3, 8))
        
        self.load_button = ctk.CTkButton(
            list_frame,
            text="Load Selected Employee",
            command=self.load_selected_employee,
            height=30,
            font=ctk.CTkFont(size=11, weight="bold")
        )
        self.load_button.pack(fill="x")
        
        self.update_employee_list()
        
    def save_employee(self):
        if self.validate_form():
            employee = {
                "name": self.name_entry.get(),
                "age": int(self.age_entry.get()),
                "gender": self.gender_var.get(),
                "salary": float(self.salary_entry.get()),
                "position": self.position_entry.get(),
                "country": self.country_combo.get()
            }
            
            self.employees.append(employee)
            self.save_data()
            self.update_employee_list()
            self.clear_form()
            messagebox.showinfo("Success", "Employee saved successfully!")
    
    def update_employee(self):
        if self.current_employee_index >= 0 and self.validate_form():
            employee = {
                "name": self.name_entry.get(),
                "age": int(self.age_entry.get()),
                "gender": self.gender_var.get(),
                "salary": float(self.salary_entry.get()),
                "position": self.position_entry.get(),
                "country": self.country_combo.get()
            }
            
            self.employees[self.current_employee_index] = employee
            self.save_data()
            self.update_employee_list()
            self.clear_form()
            self.current_employee_index = -1
            messagebox.showinfo("Success", "Employee updated successfully!")
        else:
            messagebox.showwarning("Warning", "Please select an employee to update!")
    
    def clear_form(self):
        self.name_entry.delete(0, "end")
        self.age_entry.delete(0, "end")
        self.gender_var.set("Male")
        self.salary_entry.delete(0, "end")
        self.position_entry.delete(0, "end")
        self.country_combo.set("United States")
        self.current_employee_index = -1
    
    def validate_form(self):
        if not self.name_entry.get().strip():
            messagebox.showerror("Error", "Please enter a name!")
            return False
        
        try:
            age = int(self.age_entry.get())
            if age <= 0 or age > 150:
                messagebox.showerror("Error", "Please enter a valid age (1-150)!")
                return False
        except ValueError:
            messagebox.showerror("Error", "Please enter a valid age!")
            return False
        
        try:
            salary = float(self.salary_entry.get())
            if salary < 0:
                messagebox.showerror("Error", "Salary cannot be negative!")
                return False
        except ValueError:
            messagebox.showerror("Error", "Please enter a valid salary!")
            return False
        
        if not self.position_entry.get().strip():
            messagebox.showerror("Error", "Please enter a position!")
            return False
        
        return True
    
    def update_employee_list(self):
        self.employee_listbox.delete("1.0", "end")
        
        if not self.employees:
            self.employee_listbox.insert("1.0", "No employees found.")
            return
        
        for i, emp in enumerate(self.employees):
            employee_info = f"{i+1}. {emp['name']} - {emp['position']} - {emp['country']}\n"
            employee_info += f"   Age: {emp['age']}, Gender: {emp['gender']}, Salary: ${emp['salary']:,.2f}\n\n"
            self.employee_listbox.insert("end", employee_info)
    
    def load_selected_employee(self):
        try:
            cursor_pos = self.employee_listbox.index("insert")
            cursor_line = int(cursor_pos.split('.')[0])
            employee_index = (cursor_line - 1) // 3
            
            if 0 <= employee_index < len(self.employees):
                emp = self.employees[employee_index]
                
                self.name_entry.delete(0, "end")
                self.name_entry.insert(0, emp['name'])
                
                self.age_entry.delete(0, "end")
                self.age_entry.insert(0, str(emp['age']))
                
                self.gender_var.set(emp['gender'])
                
                self.salary_entry.delete(0, "end")
                self.salary_entry.insert(0, str(emp['salary']))
                
                self.position_entry.delete(0, "end")
                self.position_entry.insert(0, emp['position'])
                
                self.country_combo.set(emp['country'])
                
                self.current_employee_index = employee_index
                messagebox.showinfo("Success", f"Loaded employee: {emp['name']}")
            else:
                messagebox.showwarning("Warning", "Please click on an employee entry!")
                
        except Exception as e:
            messagebox.showerror("Error", "Please click on an employee entry to load!")
    
    def save_data(self):
        try:
            with open(self.data_file, 'w') as f:
                json.dump(self.employees, f, indent=4)
        except Exception as e:
            messagebox.showerror("Error", f"Failed to save data: {str(e)}")
    
    def load_data(self):
        try:
            if os.path.exists(self.data_file):
                with open(self.data_file, 'r') as f:
                    self.employees = json.load(f)
        except Exception as e:
            messagebox.showerror("Error", f"Failed to load data: {str(e)}")
            self.employees = []
    
    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    app = EmployeeEntryForm()
    app.run()
