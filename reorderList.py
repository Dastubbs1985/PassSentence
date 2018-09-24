import random

passwords = []
x = 0
y = 0
while x == 0: 
	numbers = random.sample(xrange(0, 20), 5)
	ordered = numbers.sort(key=int)
	password = ','.join(str(x) for x in numbers)
	if password in passwords:
		x = 1
		print 'Password Duplicated'
	else:
		passwords.append(password)
		y += 1
		print y

