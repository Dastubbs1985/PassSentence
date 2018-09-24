import random

sentence = 'ManchesterMetropolitanUniversity0123456789|{_@&'
size = len(sentence)
passwords = []
orderedNumbers = []
charList = list(sentence)
print str(len(charList))
passCharacters = []
filename = 'DaleStubbs.txt'
user = 'DaleStubbs'
x = 0
counter = 0
with open(filename, 'w') as f:
	f.write('Passwords for ' + user)
	f.close()
with open(filename, 'a+') as f:
	while x != 1:
		charPlaces = random.sample(xrange(0, size - 14), 12)
		num = random.randint(size - 14, size - 4)
		sChar = random.randint(size - 4, size-1)
		charPlaces.append(num)
		charPlaces.append(sChar)
		charPlaces.sort(key=int)
		ordered = ','.join(str(x) for x in charPlaces)
		if ordered in orderedNumbers:
			x = 1
			print 'Password Duplicated'
		else:
			orderedNumbers.append(ordered)
			random.shuffle(charPlaces)
			for i in range(len(charPlaces)):
				y = charPlaces[(i)]
				char = charList[(y)]
				passCharacters.append(char)
			password = ''.join(passCharacters)
			passCharacters = []
			passwords.append(password)
			f.write('\n' + password)
			passwords = []
			counter += 1
			print counter
f.close()