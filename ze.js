// Example 1:

// Input: word1 = "abc", word2 = "pqr"
// Output: "apbqcr"
// Explanation: The merged string will be merged as so:
// word1:  a   b   c
// word2:    p   q   r
// merged: a p b q c r
// Example 2:

// Input: word1 = "ab", word2 = "pqrs"
// Output: "apbqrs"
// Explanation: Notice that as word2 is longer, "rs" is appended to the end.
// word1:  a   b
// word2:    p   q   r   s
// merged: a p b q   r   s
// Example 3:

// Input: word1 = "abcd", word2 = "pq"
// Output: "apbqcd"
// Explanation: Notice that as word1 is longer, "cd" is appended to the end.
// word1:  a   b   c   d
// word2:    p   q
// merged: a p b q c   d

// /**
//  * @param {string} word1
//  * @param {string} word2
//  * @return {string}
//  */
// var mergeAlternately = function (word1, word2) {
//   let maxLength = Math.max(word1.length, word2.length);

//   let merged = "";
//   for (let i = 0; i < maxLength; i++) {
//     if (i < word1.length) merged += word1[i];
//     if (i < word2.length) merged += word2[i];
//   }
//   return merged.split("").join("");
// };

// const arr = [2, 1, 3, 4, 5, 2];
// const simArr = [];
// const res = (arr) => {
//   arr.map((ele) => {
//     if (simArr.includes(ele)) {
//       return true;
//     } else {
//       simArr.push(ele);
//     }
//     return false;
//   });
// };
// console.log(res(arr));

// check anagram that string 1 and string second divide complete to 1 or not ************

// function checkAnagram(str1, str2) {
//   str1 = str1.toLowerCase().replace(/\s/g, "");
//   str2 = str2.toLowerCase().replace(/\s/g, "");

//   if (str1.length !== str2.length) {
//     return false;
//   }

//   const charCount = {};

//   for (let char of str1) {
//     charCount[char] = (charCount[char] || 0) + 1;
//   }
//   //   output => a:1,  b:1, c:1

//   for (let char of str2) {
//     if (!charCount[char]) {
//       return false; // if this char is not available in charCount return false;
//     }
//     charCount[char]--; // othervise descrement -1
//   }

//   return true;
// }

// console.log(checkAnagram("Listen", "Silent")); // true

// *************************************************************

// check analog double character .

function checkAnalogDoubleCharacter(str1, str2) {
  if (str1.length !== str2.length) {
    return false;
  }

  const str1 = str1.lowerCase();
  const str2 = str2.lowerCase();

  const charCount = {};

  for (let i = 0; i < str1.length; i++) {}
  for (let i = 0; i < str1.length; i++) {}
}
