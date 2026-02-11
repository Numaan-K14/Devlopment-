import customtkinter as ctk
from tkinter import END
import math

class Calculator:
    def __init__(self):
        # Set appearance mode and color theme
        ctk.set_appearance_mode("dark")  # "light" or "dark"
        ctk.set_default_color_theme("blue")  # "blue", "green", "dark-blue"
        
        # Create main window
        self.root = ctk.CTk()
        self.root.title("Beautiful Calculator")
        self.root.geometry("400x600")
        self.root.resizable(False, False)
        
        # Colors
        self.bg_color = "#1a1a1a"
        self.display_color = "#2d2d2d"
        self.number_color = "#404040"
        self.operator_color = "#ff6b35"
        self.equals_color = "#4CAF50"
        self.clear_color = "#f44336"
        
        # Variables
        self.current_expression = ""
        self.total = 0
        
        self.create_widgets()
        
    def create_widgets(self):
        # Main frame
        main_frame = ctk.CTkFrame(self.root, fg_color=self.bg_color)
        main_frame.pack(fill="both", expand=True, padx=10, pady=10)
        
        # Display frame
        display_frame = ctk.CTkFrame(main_frame, height=120, fg_color=self.display_color)
        display_frame.pack(fill="x", padx=10, pady=(10, 20))
        display_frame.pack_propagate(False)
        
        # Display entry
        self.display = ctk.CTkEntry(
            display_frame,
            font=ctk.CTkFont(size=32, weight="bold"),
            height=60,
            justify="right",
            border_width=0,
            fg_color="transparent",
            text_color="#ffffff"
        )
        self.display.pack(fill="both", expand=True, padx=20, pady=20)
        self.display.insert(0, "0")
        
        # Buttons frame
        buttons_frame = ctk.CTkFrame(main_frame, fg_color="transparent")
        buttons_frame.pack(fill="both", expand=True, padx=10, pady=(0, 10))
        
        # Button configuration
        button_config = {
            "font": ctk.CTkFont(size=20, weight="bold"),
            "height": 70,
            "corner_radius": 15,
            "border_width": 0
        }
        
        # Row 1: Clear, ±, %, ÷
        self.create_button(buttons_frame, "C", 0, 0, self.clear_color, self.clear_all, button_config)
        self.create_button(buttons_frame, "±", 0, 1, self.number_color, self.toggle_sign, button_config)
        self.create_button(buttons_frame, "%", 0, 2, self.number_color, lambda: self.add_to_expression("%"), button_config)
        self.create_button(buttons_frame, "÷", 0, 3, self.operator_color, lambda: self.add_operator("/"), button_config)
        
        # Row 2: 7, 8, 9, ×
        self.create_button(buttons_frame, "7", 1, 0, self.number_color, lambda: self.add_to_expression("7"), button_config)
        self.create_button(buttons_frame, "8", 1, 1, self.number_color, lambda: self.add_to_expression("8"), button_config)
        self.create_button(buttons_frame, "9", 1, 2, self.number_color, lambda: self.add_to_expression("9"), button_config)
        self.create_button(buttons_frame, "×", 1, 3, self.operator_color, lambda: self.add_operator("*"), button_config)
        
        # Row 3: 4, 5, 6, -
        self.create_button(buttons_frame, "4", 2, 0, self.number_color, lambda: self.add_to_expression("4"), button_config)
        self.create_button(buttons_frame, "5", 2, 1, self.number_color, lambda: self.add_to_expression("5"), button_config)
        self.create_button(buttons_frame, "6", 2, 2, self.number_color, lambda: self.add_to_expression("6"), button_config)
        self.create_button(buttons_frame, "-", 2, 3, self.operator_color, lambda: self.add_operator("-"), button_config)
        
        # Row 4: 1, 2, 3, +
        self.create_button(buttons_frame, "1", 3, 0, self.number_color, lambda: self.add_to_expression("1"), button_config)
        self.create_button(buttons_frame, "2", 3, 1, self.number_color, lambda: self.add_to_expression("2"), button_config)
        self.create_button(buttons_frame, "3", 3, 2, self.number_color, lambda: self.add_to_expression("3"), button_config)
        self.create_button(buttons_frame, "+", 3, 3, self.operator_color, lambda: self.add_operator("+"), button_config)
        
        # Row 5: 0 (spans 2 columns), ., =
        zero_config = button_config.copy()
        self.create_button(buttons_frame, "0", 4, 0, self.number_color, lambda: self.add_to_expression("0"), zero_config, columnspan=2)
        self.create_button(buttons_frame, ".", 4, 2, self.number_color, lambda: self.add_to_expression("."), button_config)
        self.create_button(buttons_frame, "=", 4, 3, self.equals_color, self.calculate, button_config)
        
        # Configure grid weights for responsive design
        for i in range(5):
            buttons_frame.grid_rowconfigure(i, weight=1)
        for i in range(4):
            buttons_frame.grid_columnconfigure(i, weight=1)
    
    def create_button(self, parent, text, row, col, color, command, config, columnspan=1):
        """Helper method to create styled buttons"""
        hover_color = self.adjust_color_brightness(color, 1.2)
        
        button = ctk.CTkButton(
            parent,
            text=text,
            command=command,
            fg_color=color,
            hover_color=hover_color,
            text_color="#ffffff",
            **config
        )
        button.grid(row=row, column=col, columnspan=columnspan, padx=3, pady=3, sticky="nsew")
        return button
    
    def adjust_color_brightness(self, hex_color, factor):
        """Adjust the brightness of a hex color"""
        hex_color = hex_color.lstrip('#')
        rgb = tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
        rgb = tuple(min(255, int(c * factor)) for c in rgb)
        return f"#{rgb[0]:02x}{rgb[1]:02x}{rgb[2]:02x}"
    
    def add_to_expression(self, value):
        """Add number or decimal to the current expression"""
        current = self.display.get()
        if current == "0" or current == "Error":
            self.display.delete(0, END)
            self.display.insert(0, value)
        else:
            self.display.delete(0, END)
            self.display.insert(0, current + value)
        self.current_expression += value
    
    def add_operator(self, operator):
        """Add operator to the current expression"""
        current = self.display.get()
        if current and current != "Error":
            self.current_expression += operator
            self.display.delete(0, END)
            self.display.insert(0, current + operator)
    
    def clear_all(self):
        """Clear the display and reset expression"""
        self.display.delete(0, END)
        self.display.insert(0, "0")
        self.current_expression = ""
    
    def toggle_sign(self):
        """Toggle the sign of the current number"""
        current = self.display.get()
        if current and current != "0" and current != "Error":
            if current.startswith("-"):
                new_value = current[1:]
            else:
                new_value = "-" + current
            self.display.delete(0, END)
            self.display.insert(0, new_value)
    
    def calculate(self):
        """Evaluate the current expression"""
        try:
            expression = self.display.get()
            # Replace display symbols with Python operators
            expression = expression.replace("×", "*").replace("÷", "/")
            
            # Handle percentage
            if "%" in expression:
                parts = expression.split("%")
                if len(parts) == 2:
                    expression = parts[0] + "*0.01"
            
            result = eval(expression)
            
            # Format the result
            if result == int(result):
                result = int(result)
            else:
                result = round(result, 8)
            
            self.display.delete(0, END)
            self.display.insert(0, str(result))
            self.current_expression = str(result)
            
        except:
            self.display.delete(0, END)
            self.display.insert(0, "Error")
            self.current_expression = ""
    
    def run(self):
        """Start the calculator application"""
        self.root.mainloop()

# Create and run the calculator
if __name__ == "__main__":
    calculator = Calculator()
    calculator.run()
