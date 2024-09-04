dict = {
        'I': 1,
        'V': 5,
        'X': 10,
        'L': 50,
        'C':100,
        'D': 500,
        'M': 1000
}
def romanToInt(s: str) -> int:
        i = -1
        result = 0
        while i >= -len(s):
            num = dict[s[i]]
            preceding_num = dict[s[i+1]]
            if i == -1:
                result += num
            elif num < preceding_num:
                result -= num
            else:
                result += num
            i -= 1
        return result
                

if __name__ == '__main__':
    print(romanToInt('MCMXCIX'))