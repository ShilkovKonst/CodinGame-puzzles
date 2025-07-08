const S: string = readline();
const K: number = parseInt(readline());

let longest: number = 0, left: number = 0, right: number = 0, un: number = 0;
const arr: number[] = new Array(26).fill(0);

while (right < S.length) {
    const r: number = S.charCodeAt(right++) - 97;
    if (arr[r] == 0) un++;
    arr[r]++;

    while (un > K) {
        const l = S.charCodeAt(left++) - 97;
        arr[l]--;
        if (arr[l] == 0) un--;
    }
    const length: number = right - left;
    longest = longest <= (length) ? length : longest
}
console.log(longest);