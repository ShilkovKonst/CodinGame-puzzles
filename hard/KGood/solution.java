import java.util.*;

class Solution {
    static String S;
    static int K;

    public static void main(String args[]) {
        Scanner in = new Scanner(System.in);
        S = in.nextLine();
        K = in.nextInt();

        int kGood = 0, left = 0, right = 0, unique = 0;
        int[] freq = new int[26];

        while (right < S.length()) {
            char r = S.charAt(right++);
            if (freq[r - 'a'] == 0)
                unique++;
            freq[r - 'a']++;

            while (unique > K) {
                char l = S.charAt(left++);
                freq[l - 'a']--;
                if (freq[l - 'a'] == 0)
                    unique--;
            }

            kGood = Math.max(kGood, right - left);
        }
        System.out.println(kGood);
    }
}