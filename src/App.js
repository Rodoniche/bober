import React, { useState, useEffect } from 'react';

import {
  Box,
  Flex,
  Avatar,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Checkbox,
  Button,
  Input,
  useColorMode,
  useColorModeValue,
  IconButton,
  Stack,
  useColorModeValue as mode,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Switch,
  Icon,
  Container,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  VStack,
  HStack,
  Link,
  Divider,
  useToast,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Textarea,
  Editable,
} from '@chakra-ui/react';
import { FaPlus, FaTrash, FaSun, FaMoon, FaBars, FaTasks, FaCog, FaCoins, FaComment } from 'react-icons/fa';
import { BiEdit } from 'react-icons/bi';

function App() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [tabs, setTabs] = useState([
    { name: 'Работа', tasks: [] },
    { name: 'Личное', tasks: [] },
  ]);
  const [activeTab, setActiveTab] = useState(0);
  const [newTask, setNewTask] = useState('');
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [coins, setCoins] = useState(0); // Состояние для хранения количества монет
  const [lastRewardDate, setLastRewardDate] = useState(null); // Состояние для хранения даты последней награды
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Проверка, было ли уже показано окно регистрации
  useEffect(() => {
    const hasRegistered = localStorage.getItem('hasRegistered');
    if (!hasRegistered) {
      setIsRegistrationModalOpen(true);
    }
  }, []);

  const addTab = (backgroundColor, color) => {
    const newTabName = prompt('Введите название новой вкладки', '', {
      style: {
        backgroundColor: backgroundColor,
        color: color,
      },
    });
    if (newTabName) {
      setTabs([...tabs, { name: newTabName, tasks: [] }]);
    }
  };

  const deleteTab = (index) => {
    if (index < 2) return;
    const newTabs = tabs.filter((_, i) => i !== index);
    setTabs(newTabs);
    if (activeTab === index) {
      setActiveTab(0);
    }
  };

  const addTask = () => {
    if (newTask.trim() !== '') {
      const newTabs = [...tabs];
      newTabs[activeTab].tasks.unshift({ text: newTask, completed: false, note: '' });
      setTabs(newTabs);
      setNewTask('');
    }
  };

  const handleTaskChange = (index, value) => {
    const newTabs = [...tabs];
    newTabs[activeTab].tasks[index].text = value;
    setTabs(newTabs);
  };

  const handleTaskCompletion = (index) => {
    const newTabs = [...tabs];
    newTabs[activeTab].tasks[index].completed = !newTabs[activeTab].tasks[index].completed;
    newTabs[activeTab].tasks.sort((a, b) => a.completed - b.completed);
    setTabs(newTabs);

    const completedTasks = newTabs[activeTab].tasks.filter(task => task.completed);
    const today = new Date().toDateString();

    if (completedTasks.length === 3 && (!lastRewardDate || lastRewardDate !== today)) {
      toast({
        title: "Поздравляю!",
        description: `Ты выполнил 3 задачи и получил 10 монет!`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setCoins(coins + 10); // Начисляем 10 монет за закрытие 3 заданий
      setLastRewardDate(today); // Обновляем дату последней награды
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      addTask();
    }
  };

  const handleRegistration = () => {
    localStorage.setItem('hasRegistered', 'true');
    setIsRegistrationModalOpen(false);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsRegistrationModalOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleNoteChange = (index, value) => {
    const newTabs = [...tabs];
    newTabs[activeTab].tasks[index].note = value;
    setTabs(newTabs);
  };

  const backgroundColor = useColorModeValue('white', 'gray.800');
  const color = useColorModeValue('black', 'white');

  return (
    <Box>
      <Modal isOpen={isRegistrationModalOpen} onClose={() => setIsRegistrationModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Регистрация</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Имя пользователя</FormLabel>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Введите имя пользователя"
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Пароль</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleRegistration}>
              Зарегистрироваться
            </Button>
            <Button variant="ghost" onClick={() => setIsRegistrationModalOpen(false)}>
              Закрыть
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Flex direction="column" h="100vh">
        <Flex align="center" justify="space-between" p={4} bg={useColorModeValue('gray.100', 'gray.700')}>
          <IconButton icon={<FaBars />} onClick={onOpen} aria-label="Open Menu" />
          <Text fontSize="3xl" fontWeight="bold">
            Snaily
          </Text>
          <Flex align="center">
            <HStack spacing={2} mr={4}>
              <Icon as={FaCoins} />
              <Text>{coins}</Text>
            </HStack>
            <Icon as={colorMode === 'light' ? FaSun : FaMoon} mr={2} />
            <Switch isChecked={colorMode === 'dark'} onChange={toggleColorMode} size='lg' colorScheme="blue" />
          </Flex>
        </Flex>

        <Flex flex={1}>
          <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>Меню</DrawerHeader>
              <DrawerBody>
                <VStack align="start" spacing={4}>
                  <Link onClick={() => { setActiveTab(0); onClose(); }}>
                    <HStack>
                      <Icon as={FaTasks} />
                      <Text>Задания</Text>
                    </HStack>
                  </Link>
                  <Link onClick={() => setIsRegistrationModalOpen(true)}>
                    <HStack>
                      <Icon as={FaCog} />
                      <Text>Настройки</Text>
                    </HStack>
                  </Link>
                </VStack>
              </DrawerBody>
                <div align="center">
                  <Divider />
                  <Text align="center" mb={5} mt={4}>&copy; 2024 Snaily</Text>
                
                </div>
            </DrawerContent>
          </Drawer>

          <Container maxW="container.md" centerContent flex={1} p={4}>
            <Tabs index={activeTab} onChange={(index) => setActiveTab(index)}>
              <TabList justifyContent="start" borderRadius="md">
                {tabs.map((tab, index) => (
                  <Tab 
                    key={index} 
                    _selected={{ color: 'white', bg: '#3884FD' }}
                    borderRadius="full"
                  >
                    {tab.name}
                    {index >= 2 && (
                      <IconButton
                        icon={<FaTrash />}
                        size="xs"
                        ml={2}
                        onClick={() => deleteTab(index)}
                        aria-label="Удалить вкладку"
                        borderRadius="full"
                      />
                    )}
                  </Tab>
                ))}
                <Button 
                  onClick={() => addTab(backgroundColor, color)} 
                  ml={2} 
                  size="sm" 
                  variant="outline"
                  borderRadius="full"
                  colorScheme="blue"
                >
                  <FaPlus />
                </Button>
              </TabList>
              <TabPanels>
                {tabs.map((tab, index) => (
                  <TabPanel key={index}>
                    <Stack spacing={2}>
                      {tab.tasks.map((task, taskIndex) => (
                        <Box key={taskIndex} position="relative">
                          <Box
                            position="absolute"
                            top="50%"
                            left="10px"
                            transform="translateY(-50%)"
                            fontSize="xl"
                            fontWeight="bold"
                            color="gray.400"
                            zIndex="-1"
                          >
                            {taskIndex + 1}
                          </Box>
                          <Checkbox
                            colorScheme="teal"
                            isChecked={task.completed}
                            onChange={() => handleTaskCompletion(taskIndex)}
                            mb={2}
                            pl="40px"
                            isDisabled={task.completed}
                          >
                            <Input
                              value={task.text}
                              onChange={(e) => handleTaskChange(taskIndex, e.target.value)}
                              placeholder={`Задача ${taskIndex + 1}`}
                              variant="unstyled"
                              isDisabled={task.completed}
                            /> 
                          
                          </Checkbox>
                          <Popover>
                            <PopoverTrigger>
                              <IconButton
                                icon={<BiEdit />} // добавялем примечания к задачам компонент popover
                                size="sm"
                                ml={2}
                                aria-label="Добавить примечание"
                                borderRadius="full"
                              />
                            </PopoverTrigger>
                            <PopoverContent>
                              <PopoverArrow />
                              <PopoverCloseButton />
                              <PopoverHeader>Примечание</PopoverHeader>
                              <PopoverBody>
                                <Textarea
                                  value={task.note}
                                  onChange={(e) => handleNoteChange(taskIndex, e.target.value)}
                                  placeholder="Добавьте примечание"
                                />
                              </PopoverBody>
                            </PopoverContent>
                          </Popover>
                        </Box>
                      ))}
                    </Stack>
                    <Flex mt={4}>
                      <Input
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Добавить задачу"
                      />
                      <Button onClick={addTask} ml={2} colorScheme="blue" bg="#3884FD" _hover={{ bg: "#2A69AC" }}>
                        Добавить
                      </Button>
                    </Flex>
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          </Container>
        </Flex>
      </Flex>
    </Box>
  );
}

export default App;