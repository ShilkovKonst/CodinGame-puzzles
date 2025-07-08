class Solution
{
    static int K;
    static string S;

    static void Main(string[] args)
    {
        S = Console.ReadLine();
        K = int.Parse(Console.ReadLine());

        int[] freq = new int[26];
        int longest = 0, left = 0, right = 0, unique = 0;

        while (right < S.Length)
        {
            char c = S[right];
            if (freq[c - 'a'] == 0) unique++;
            freq[c - 'a']++;

            while (unique > K)
            {
                char l = S[left];
                freq[l - 'a']--;
                if (freq[l - 'a'] == 0) unique--;
                left++;
            }
            longest = Math.Max(longest, right - left + 1);
            right++;
        }

        Console.WriteLine(longest);
    }
}