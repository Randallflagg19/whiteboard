export function DataError() {
  return (
    <div className="data-error" role="alert">
      <span className="data-error-icon" aria-hidden="true">!</span>
      <h2>Не удалось загрузить данные</h2>
      <p>Проверь подключение к серверу и обнови страницу.</p>
    </div>
  );
}
