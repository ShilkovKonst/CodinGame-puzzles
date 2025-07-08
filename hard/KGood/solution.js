const S = readline();
const K = parseInt(readline());

let longest = 0, left = 0, right = 0, un = 0;
const arr = new Array(26).fill(0);

while (right < S.length) {
    const r = S.charCodeAt(right++) - 97;
    if (arr[r] == 0) un++;
    arr[r]++;

    while (un > K) {
        const l = S.charCodeAt(left++) - 97;;
        arr[l]--;
        if (arr[l] == 0) un--;
    }
    const length = right - left;
    longest = longest <= (length) ? length : longest
}
console.log(longest);