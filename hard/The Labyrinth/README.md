# The Goal

Once teleported inside the structure, your mission is to:

- **find the control room** from which you will be able to deactivate the tracker beam
- **get back to your starting position** once you've deactivated the tracker beam

---

## Rules

The structure is arranged as a **rectangular maze** composed of cells. Within the maze Rick can go in any of the following directions: **_UP_**, **_DOWN_**, **_LEFT_** or **_RIGHT_**.

Rick is using his tricorder to scan the area around him but due to a disruptor field, **he is only able to scan the cells located in a 5-cell wide square centered on him**.

Unfortunately, Spock was correct, there is a trap! **Once you reach the control room an alarm countdown is triggered and you have only a limited number of rounds before the alarm goes off**. Once the alarm goes off, Rick is doomed...

Rick will die if any of the following happens:

- **Rick's jetpack runs out of fuel**. You have enough fuel for 1200 movements.
- **Rick does not reach the starting position before the alarm goes off**. The alarm countdown is triggered once the control room has been reached.
- **Rick touches a wall or the ground**: he is ripped apart by a mechanical trap.

You will be successful if you reach the control room and get back to the starting position before the alarm goes off.

**Maze format**  
A maze in ASCII format is provided as input. The character **#** represents a wall, the letter **.** represents a hollow space, the letter **T** represents your starting position, the letter **C** represents the control room and the character **?** represents a cell that you have not scanned yet. For example:

```
??????????????????????????????
#..............???????????????
#.#############???????????????
#.....T........???????????????
#.......................#.#..#
#.#######################.#..#
#.....##......##......#....###
#...####..##..##..##..#..#...#
#.........##......##.....#.C.#
##############################
```

Starting position is at row 3, column 6.
Control room is at row 8, column 27.
(Indexes start at zero)

---

## Game Input

The program must first read the initialization data from standard input. Then, within an infinite loop, read the data from the standard input related to the maze's current state and provide to the standard output the next movement instruction.

### Initialization Input

**Line 1**: 3 integers: **R C A**
- **R,C** are the numbers of rows and columns of the maze.
- **A**, is the number of rounds between the time the alarm countdown is activated and the time the alarm goes off.

### Input for One Game Turn

- **Line 1**: 2 integers: **KR** and **KC**. Rick is located at row KR and column KC within the maze. The cell at row 0 and column 0 is located in the top left corner of the maze.
- **Next R lines**: **C** characters  **#** or  **.** or  **T** or  **C** or  **?** (i.e. one line of the ASCII maze)

### Output for One Game Turn

A **single line** containing one of: **UP** **DOWN** **LEFT** or **RIGHT**

---

## Constraints

10 ≤ **R** ≤ 100  
20 ≤ **C** ≤ 200  
1 ≤ **A** ≤ 100  
0 ≤ **KR** < R  
0 ≤ **KC** < C  
Response time per turn ≤ 150ms  
There at a single T character and a single C character within a maze
