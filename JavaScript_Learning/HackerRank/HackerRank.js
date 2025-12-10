// Given five positive integers, find the minimum and maximum values that can be calculated by summing exactly four of the five integers. Then print the respective minimum and maximum values as a single line of two space-separated long integers.
// Example arr[7 ,69 ,2, 221, 8974]
//FIND MINIMUM AND MAXIMUM NO. EXPECTED O/P is :
//299 9271


function miniMaxSum(arr) {
    arr.sort((a,b)=>a-b);
    // console.log(arr)
    let min=0;
    let max=0;
    for(let i=0;i<arr.length-1;i++){
        min+=arr[i];
    }
    for(let i=1;i<arr.length;i++){
        max+=arr[i];
    }
    console.log(min,max);

}
miniMaxSum([7, 69, 2, 221, 8974]);


// find the biggest number in the array and return its  count .
// Example
// candles=[4,4,1,3]
// The tallest candles are 4 units high. There are 2 candles with this height, so the function should return 2.

function birthdayCakeCandles(candles) {
    // Step 1: sabse bada number find karo using Math.max
    let max = Math.max(...candles); // Spread operator se array ke elements Math.max ko diye

    // Step 2: count karo ki kitni baar max aya hai
    let count = 0;
    for (let i = 0; i < candles.length; i++) {
        if (candles[i] === max) {
            count++;    
        }
    }

    return count;
}

console.log(birthdayCakeCandles([3, 2, 1, 3])); // Output: 2


// The first line contains two space-separated integers denoting the respective values of s and t.
// The second line contains two space-separated integers denoting the respective values of a and b.
// The third line contains two space-separated integers denoting the respective values of m and n.
// The fourth line contains m space-separated integers denoting the respective distances that each apple falls from point a.
// The fifth line contains n space-separated integers denoting the respective distances that each orange falls from point b.
//input fields :

// s = 7, t = 11        (Sam ka ghar 7 se 11 tak hai)
// a = 5                (Apple tree ka position)
// b = 15               (Orange tree ka position)
// apples = [-2, 2, 1]  (3 apples, distances diya hai)
// oranges = [5, -6]    (2 oranges, distances diya hai)

function countApplesAndOranges(s, t, a, b, apples, oranges) {
let ApplePos =0;
let orgPos=0;
for(let i=0;i<apples.length;i++){
    let position = a + apples[i];
    if(position >=s && position <= t){
        ApplePos++;
    }
}
for(let i=0;i<oranges.length;i++){
    let position = b + oranges[i];
    if(position >=s && position <= t){
        orgPos++;
    }
}
console.log(ApplePos);
console.log(orgPos);
}
countApplesAndOranges(7, 11, 5, 15,[-2,2,1],[5,-6]);

//There is a sequence of words in CamelCase as a string of letters, , having the following properties:
// -It is a concatenation of one or more words consisting of English letters.
// -All letters in the first word are lowercase.
// -For each of the subsequent words, the first letter is uppercase and rest of the letters are lowercase.
// Given s, determine the number of words in s.

// Example:
// s ="saveChangesInTheEditor";
// There are 5 words in the string: 'save', 'Changes', 'In','The','Editor'.
// we want the actual count.

function camelcase(s) {
    let count=1;// camelCase's starting mein count 1 rakha, kyunki pehla word small letter se start hota hai
    for(let i=0;i<s.length;i++){
    if(s[i] >= 'A' && s[i] <= 'Z'){
        count++;
    }
 }
    return count;
}
console.log(camelcase("saveChangesInTheEditor"))

//Covert random numbers into array 
function generateRandomArray(length) {
  const randomNumbers = [];
  for (let i = 0; i < length; i++) {
    const randomNumber = Math.floor(Math.random() * 101); // Generates a random integer from 0 to 100
    randomNumbers.push(randomNumber);
  }
  return randomNumbers;
}
const myArray = generateRandomArray(100); // Creates an array of 5 random numbers
console.log(myArray);


// students round of 5 

function gradingStudents(grades) {
  let result = [];  // final answers rakhenge

  for (let i = 0; i < grades.length; i++) {
    let grade = grades[i]; // current number le liya

    if (grade < 38) {
      // 38 se chhota hai → round nahi hoga
      result.push(grade);
    } else {
      // next multiple of 5 nikalte hain
      let nextMultiple = grade + (5 - (grade % 5));

      // agar difference 3 se kam hai toh round karo
      if (nextMultiple - grade < 3) {
        result.push(nextMultiple);
      } else {
        result.push(grade);
      }
    }
  }

  return result;
}

console.log(gradingStudents([73, 67, 38, 33]));
// Output: [75, 67, 40, 33]



// If Brian did not overcharge Anna, print Bon Appetit… Otherwise print the difference (b - correct_share).
// You check Anna’s fair share → (sum of all items except k) / 2.
// Compare with b:
// If b == correct_share → print "Bon Appetit"
// Else → print b – correct_share (integer refund amount).
// 7. Sample Input 
// 4 1
// 3 10 2 9
// 12
// n = 4 items, k = 1 → item at index 1 costs 10, Anna didn’t eat it.
// bill = [3, 10, 2, 9]
// b = 12 → Brian charged Anna 12.
// Step-by-step:
// Total cost of all items except item 1 = 3 + 2 + 9 = 14
// Anna's share = 14 / 2 = 7
// But Brian charged 12.
// Overcharge = 12 – 7 = 5.
// Output: 5

function bonAppetit(bill, k, b) {
  // Remove the item Anna didn'
  bill.splice(k, 1);

  // Sum all remaining items
  let total = 0;
  for (let i = 0; i < bill.length; i++) {
    total += bill[i];
  }

  // Anna's fair share
  let fairShare = total / 2;

  if (b === fairShare) {
    console.log("Bon Appetit");
  } else {
    console.log(Math.abs(b - fairShare));
  }
}

bonAppetit([3, 10, 2, 9], 1, 12);


//24 HOURS TIME FORMAT CODE convert 12pm hrs into 24pm

function timeConversation(s) {
  
}



//Subarray Division 

// Suppose s = [1,2,1,3,2], d = 3, m = 2
// Pehla window = [1,2] → sum = 3 → count = 1
// Window slide → [2,1]
// purana element 1 hatao → sum = 3 - 1 = 2
// naya element 1 add karo → sum = 2 + 1 = 3 → count = 2
// Window slide → [1,3]
// purana element 2 hatao → sum = 3 - 2 = 1
// naya element 3 add karo → sum = 1 + 3 = 4 → no count
// Window slide → [3,2]
// purana element 1 hatao → sum = 4 - 1 = 3
// naya element 2 add karo → sum = 3 + 2 = 5 → no count
// Final answer → count = 

// /---chatGpt--
function birthday(s, d, m) {
    let count = 0;
    let sum = 0;

  
    for (let i = 0; i < m; i++) {
        sum += s[i];
    }
    if (sum === d) count++;

    for (let i = m; i < s.length; i++) {
        sum = sum - s[i - m] + s[i];
        if (sum === d) count++;
    }

    return count;
}
console.log(birthday([1, 2, 1, 3, 2], 3, 2)); 
console.log(birthday([4], 4, 1)); 

// mylogic
function birthday(s, d, m) {
  let count=0;
  for(let i=0;i<=s.length;i++){
    let currentSum = s[i] + s[i+1];
    if(currentSum === d){
        count++
    }
  }
  return count;
}
console.log(birthday([1, 2, 1, 3, 2], 3, 2));
// ----
function birthday(s, d, m) {
  let count=0;
  let total=0;
  for(let i=0;i<s.length;i++){
    if(total+=s[i] === d){
        count++;
    }
    
  }
  return count;
}
console.log(birthday([4], 4, 1));

//Angry Proffessor :

function angryProfessor(k, a) {
    let count=0;
    for(let i=0;i<a.length;i++){
       if(a[i] <=0){
        count++
       } 
    }
    if(count >=k ){
        return "NO";
    }else {
        return "YES";
    }

}

