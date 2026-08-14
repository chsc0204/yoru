import pygame
import random
import sys

pygame.init()

# 화면 설정
CELL_SIZE = 20
GRID_WIDTH = 30
GRID_HEIGHT = 20
WIDTH = CELL_SIZE * GRID_WIDTH
HEIGHT = CELL_SIZE * GRID_HEIGHT

# 색상
BLACK = (20, 20, 20)
GREEN = (0, 200, 0)
DARK_GREEN = (0, 150, 0)
RED = (220, 50, 50)
WHITE = (255, 255, 255)
GRAY = (60, 60, 60)

screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Snake Game")
clock = pygame.time.Clock()
font = pygame.font.SysFont("malgungothic", 24)
big_font = pygame.font.SysFont("malgungothic", 48)

DIRECTIONS = {
    pygame.K_UP: (0, -1),
    pygame.K_DOWN: (0, 1),
    pygame.K_LEFT: (-1, 0),
    pygame.K_RIGHT: (1, 0),
    pygame.K_w: (0, -1),
    pygame.K_s: (0, 1),
    pygame.K_a: (-1, 0),
    pygame.K_d: (1, 0),
}


def random_food(snake):
    while True:
        pos = (random.randint(0, GRID_WIDTH - 1), random.randint(0, GRID_HEIGHT - 1))
        if pos not in snake:
            return pos


def draw_cell(pos, color):
    rect = pygame.Rect(pos[0] * CELL_SIZE, pos[1] * CELL_SIZE, CELL_SIZE, CELL_SIZE)
    pygame.draw.rect(screen, color, rect)
    pygame.draw.rect(screen, BLACK, rect, 1)


def draw_grid():
    for x in range(0, WIDTH, CELL_SIZE):
        pygame.draw.line(screen, GRAY, (x, 0), (x, HEIGHT))
    for y in range(0, HEIGHT, CELL_SIZE):
        pygame.draw.line(screen, GRAY, (0, y), (WIDTH, y))


def show_message(text, sub_text=""):
    screen.fill(BLACK)
    msg = big_font.render(text, True, WHITE)
    rect = msg.get_rect(center=(WIDTH // 2, HEIGHT // 2 - 20))
    screen.blit(msg, rect)
    if sub_text:
        sub = font.render(sub_text, True, WHITE)
        sub_rect = sub.get_rect(center=(WIDTH // 2, HEIGHT // 2 + 30))
        screen.blit(sub, sub_rect)
    pygame.display.flip()


def game_loop():
    snake = [(GRID_WIDTH // 2, GRID_HEIGHT // 2)]
    direction = (1, 0)
    next_direction = direction
    food = random_food(snake)
    score = 0
    moves_per_sec = 10
    direction_queue = []
    last_move_time = pygame.time.get_ticks()

    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            if event.type == pygame.KEYDOWN:
                if event.key in DIRECTIONS:
                    new_dir = DIRECTIONS[event.key]
                    # 큐의 마지막 방향(없으면 현재 방향) 기준으로 반대 방향 진입 차단
                    pending = direction_queue[-1] if direction_queue else direction
                    if (new_dir[0] * -1, new_dir[1] * -1) != pending and new_dir != pending:
                        if len(direction_queue) < 2:
                            direction_queue.append(new_dir)
                if event.key == pygame.K_ESCAPE:
                    pygame.quit()
                    sys.exit()

        now = pygame.time.get_ticks()
        move_interval = 1000 / moves_per_sec
        if now - last_move_time >= move_interval:
            last_move_time = now
            if direction_queue:
                direction = direction_queue.pop(0)

            head = snake[0]
            new_head = (head[0] + direction[0], head[1] + direction[1])

            # 벽 충돌
            if not (0 <= new_head[0] < GRID_WIDTH and 0 <= new_head[1] < GRID_HEIGHT):
                return score
            # 자기 몸 충돌
            if new_head in snake:
                return score

            snake.insert(0, new_head)

            if new_head == food:
                score += 1
                food = random_food(snake)
                moves_per_sec = min(22, 10 + score // 4)
            else:
                snake.pop()

        screen.fill(BLACK)
        draw_grid()
        draw_cell(food, RED)
        for i, segment in enumerate(snake):
            draw_cell(segment, GREEN if i == 0 else DARK_GREEN)

        score_text = font.render(f"Score: {score}", True, WHITE)
        screen.blit(score_text, (10, 5))

        pygame.display.flip()
        clock.tick(60)


def main():
    show_message("Snake Game", "아무 키나 눌러 시작 (방향키/WASD, ESC 종료)")
    waiting = True
    while waiting:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            if event.type == pygame.KEYDOWN:
                waiting = False

    while True:
        final_score = game_loop()
        show_message("Game Over", f"점수: {final_score}  |  R: 재시작  ESC: 종료")
        restarting = True
        while restarting:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    pygame.quit()
                    sys.exit()
                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_r:
                        restarting = False
                    elif event.key == pygame.K_ESCAPE:
                        pygame.quit()
                        sys.exit()


if __name__ == "__main__":
    main()
