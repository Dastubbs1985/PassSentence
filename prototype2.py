#################################################
#												#
#	Dale Stubbs - 14024149						#
#	This program is designed generate and store #
#	passwords from a users PassSentence			#
#	I will be converting this program into 		#
#	a browser plugin file. 						#
#												#
#	Created - 		16/12/2016					#
#	Last edited - 	23/01/2017					#
#												#
#################################################
import random
import sys
import os.path

#  Required Global Variables.
user = ''
passCharPlace = []
website = ''
passSentence = []
print 'Welcome to my PassSentence Manager.'
def main():
	print '\nWould you like to (l)ogin or (s)ignup?: '
	option = raw_input()
	global user
	if option == 's':
		#  This section creates a new user based on the input Username.
		#  When I create the browser plugin I will connect the program to a database
		#  and ensure that all usernames are unique.
		print 'Please enter your user name: '
		user = raw_input()
		filename = user + '.txt'
		createUser(filename)
		print 'The sentence you select will be used to generate all of your passwords. \nIt must be a minimum of 20 characters long in order to create all of your required passwords. Your chosen sentence requires only letters as the program will add any additional characters required. Your letters must be a mixture of upper and lower case letters.'
		x = 0
		while x == 0:
			print 'Please enter your PassSentence: '
			global passSentence
			passSentence = raw_input()
			size = len(passSentence)
			upperCase = [l for l in passSentence if l.isupper()]
			#  Ensures the length and contents of the PassSentence meet the rules outlined above.
			if size >= 20 and len(upperCase) > 0:
				x = 1
			elif size < 20:
				print 'PassSentence is too small. It only contains ' + str(size) + ' characters.'
			elif len(upperCase) == 0:
				print 'There are no capital letters in your PassSentence. Please include at least 1 capital letter.'
		createPassword()
	elif option == 'l':
		x = 0
		while x == 0:
			print 'Please enter your user name: '
			user = raw_input()
			#  Checks to see if the username actually exists.
			if os.path.isfile(user):
				x = 1
			else:
				print 'User Name Not Found. Please try again.'
				continue
		print 'Please enter your PassSentence: '
		passSentence = raw_input()
		x = 0
		while x == 0:
			print 'Would you like to (c)reate a new password or (v)iew your existing passwords? '
			sel = raw_input()
			if sel == 'c':
				x = 1
				createPassword()
			elif sel == 'v':
				x=1
				viewPasswords()
			else:
				print 'Selection not recognised. Please enter \'c\' or \'v\' to continue.'
def createPassword():
	print 'What is the website where the generated password will be used? '
	global website 
	website = raw_input()
	size = len(passSentence)
	generatedSentence = EditSentence(passSentence)
	generatePassword(generatedSentence, passSentence, size)

def generatePassword(generatedSentence, passSentence, size):
	passCharPlace = CharPlacesList(generatedSentence, size, passSentence)
	charList = list(generatedSentence)
	passCharacters = []
	#  Password is built
	for i in range(len(passCharPlace)):
		x = passCharPlace[(i)]
		char = charList[(x)]
		passCharacters.append(char)
	password = ''.join(passCharacters)
	upperCase = [l for l in password if l.isupper()]
	if len(upperCase) < 1:
		generatePassword(generatedSentence, passSentence, size)
	else:
		print 'Password: ' + password
	y = 0
	while y == 0:
		#  Allows for the user to generate a new password if they're not happy with the first one displayed.
		print 'Are you happy with the provided password? (y/n)'
		choice = raw_input()
		if choice == 'n':
			y = 1
			generatePassword(generatedSentence, passSentence, size)
		elif choice == 'y':
			y = 1
			storePassword(generatedSentence, website, passCharPlace)
		else:
			print 'Choice not recognised. Please only enter a \'y\' or an \'n\'.'
	x = 0
	while x == 0:
		print 'Would you like to (c)reate another password, (v)iew your current passwords or (e)xit the program?'
		choice = raw_input()
		if choice == 'c':
			x = 1
			createPassword()
		elif choice == 'v':
			x = 1
			viewPasswords()
		elif choice == 'e':
			x = 1
			sys.exit()
		else:
			print 'Choice not recognised. Please enter a \'c\', \'v\' or \'e\' to continue.'

def CharPlacesList(generatedSentence, size, passSentence):
	#  Selection of which characters that will be used for the password is done in this function.
	charPlaces = random.sample(xrange(0, size - 1), 12)
	if len(generatedSentence) == size:
		random.shuffle(charPlaces)
	elif len(generatedSentence) == size + 10:
		num = random.randint(size - 1, size + 9)
		charPlaces.append(num)
		random.shuffle(charPlaces)
	elif len(generatedSentence) == size + 5:
		sChar = random.randint(size -1, size + 4)
		charPlaces.append(sChar)
		random.shuffle(charPlaces)
	else:
		num = random.randint(size - 1, size + 9)
		sChar = random.randint(size + 9, size + 14)
		charPlaces.append(num)
		charPlaces.append(sChar)
		random.shuffle(charPlaces)
	return charPlaces

def EditSentence(passSentence):
	#  Construction of the sentence is done inside this function.
	x = 0
	while x == 0:
		print 'Does the password require a number? (y/n)'
		selection = raw_input()
		if selection == 'y':
			x = 1
			numbers = '0123456789'
		elif selection == 'n':
			x = 1
			numbers = ''
		else:
			print 'Selection not valid. Please enter a \'y\' or \'n\' only'
	y = 0
	while y == 0:
		print 'Does the password require a special character? (y/n)'
		selection  = raw_input()
		if selection == 'y':
			y = 1
			sCharacters = '|{_@&'
		elif selection == 'n':
			y = 1
			sCharacters = ''
		else:
			print 'Selection not valid. Please enter a \'y\' or \'n\' only'
	editedSentence = passSentence + numbers + sCharacters
	return editedSentence

def storePassword(generatedSentence, website, passCharPlace):
	#  The character places as well as the length of the generated sentence are sent out to the correct file.
	#  The Generated Sentence length is appended to the end of the character places to ensure the correct password is read back in.
	filename = user + '.txt'
	password = ','.join(str(x) for x in passCharPlace) + ',' + str(len(generatedSentence))
	line1 = '\n' + website + ' : ' + password
	with open(filename, 'a+') as f:
		f.write(line1)
		f.close()


def viewPasswords():
	#  This function allows the user to see their existing passwords in the file. This will allow them to copy and paste their password in the necessary webpage.
	global passSentence
	passwords = []
	with open(user + '.txt', 'rb') as file:
		for line in file.readlines():
			if 'Passwords' in line:
				continue
			string = line.strip('\r\n')
			passwords.append(string)
			if len(passSentence) == 0:
				print string
	file.close()
	if len(passSentence) == 0:
		print 'To view the text version of your passwords please enter your PassSentence: '
		passSentence = raw_input()
	passCharacters = []
	for x in range(len(passwords)):
		line = passwords[(x)]
		splitLine = line.split(':')
		passwordPre = splitLine[1].strip()
		finalPassword = passwordPre.split(',')
		passCharPlace = list(finalPassword)
		passCharPlace = map(int, passCharPlace)
		#  Checks the last element of the password to ensure the right settings are met when reading the passwords back into the program.
		if passCharPlace[(-1)] == len(passSentence):
			generatedSentence = passSentence
			charList = list(generatedSentence)
		elif passCharPlace[(-1)] == len(passSentence) + 5:
			generatedSentence = passSentence + '|{_@&'
			charList = list(generatedSentence)
		elif passCharPlace[(-1)] == len(passSentence) + 10:
			generatedSentence = passSentence + '0123456789'
			charList = list(generatedSentence)
		else:
			generatedSentence = passSentence + '0123456789|{_@&'
			charList = list(generatedSentence)
		for y in range(len(passCharPlace)-1):
			x = passCharPlace[(y)]
			char = charList[(x)]
			passCharacters.append(char)
		password = ''.join(passCharacters)
		print 'Password for ' + splitLine[0].strip() + ' : ' + password
		passCharacters = []
	x = 0
	while x == 0:
		print 'Would you like to (c)reate a new password or (e)xit the program?'
		choice = raw_input()
		if choice == 'c':
			x = 1
			createPassword()
		elif choice == 'e':
			x = 1
			sys.exit()
		else:
			print 'Choice not recognised. Please enter a \'c\' or an \'e\' to continue.'
def createUser(filename):
	#  Creates a file using the input username by te user.
	with open(filename, 'w') as f:
		f.write('Passwords for ' + user)
		f.close()

if __name__ == "__main__":
    main()