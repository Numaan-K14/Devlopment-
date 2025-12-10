

while True:
    print("1. Addition : ")
    print("2. Subtraction : ")
    print("3. Multiplication : ")
    print("4. Division : ")
    print("5. Exponent : ")
    print("6. Exit : ")

    choice = int(input("\nWhat you want to perform (Add/Sub/Mult/Div) : "))
    if choice == 1:
        # Addition
        numbers = input("Enter numbers separated by + : ").split('+')
        def addition(*args):
            total = 0
            for num in args:
                total += num
            return total
        num_list = []
        for n in numbers:
            num_list.append(int(n))
        print(addition(*num_list))
    elif choice == 2:
        # Subtraction
        numbers = input("Enter numbers separated by - : ").split('-')
        def subtraction(*args):
            total = args[0]
            for num in args[1:]:
                total = total - num
            return total
        num_list = []
        for n in numbers:
            num_list.append(int(n))
        print(subtraction(*num_list))
    elif choice == 3:
        # Multiplication
        numbers = input("Enter numbers separated by x : ").split('x')
        def multiplication(*args):
            total = 1
            for num in args:
                total *= num
            return total
        num_list = []
        for n in numbers:
            num_list.append(int(n))
        print(multiplication(*num_list))
    elif choice == 4:
        # Division
        numbers = input("Enter numbers separated by / : ").split('/')
        def division(*args):
            total = args[0]
            for num in args[1:]:
                if num != 0:
                    total /= num
                else :
                    print("Zero division is not possible!")
            return total
        num_list = []
        for n in numbers:
            num_list.append(int(n))
        print(division(*num_list))

    elif choice == 5:
        numbers = input("Enter numbers seperated by ^ : ").split('^')
        def exponent(*args):
            total = args[0]
            for i in args[1:]:
                total = total**i
            return total
        num_list = []
        for n in numbers:
            num_list.append(int(n))
        print(exponent(*num_list))

    elif choice == 6:
        break

    else:
        print("Invalid Choice!");