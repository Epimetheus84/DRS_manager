# GUI для синхронизации докер реестров

### Запуск докер контейнера 
docker run --privileged -v $(pwd)/configs/config.yml:/srv/flask_app/config.yml -d -p 80:80 drs_manager \
Подробнее про флаг --privileged https://hub.docker.com/r/jpetazzo/dind/dockerfile

### config.yml - Файл настроек синхронизации\
Используя gui их можно менять ( %server_address%/settings )\
Пример пустого файла:
```
dst_registry:
  ADDRESS: null // адрес dst реестра (destination)
  PASSWORD: null  // password авторизации в докер реестр (если запрашивается)
  USERNAME: null // login авторизации в докер реестр (если запрашивается)
prefixes:
- dev // Префикс тегов для фильтрации (пр. ubuntu:dev_1 будет залит на dst, а ubuntu:prod нет) 
repositories:
- my-ubuntu_1 // репозитории для синхронизации (поиск только по полному совпадению)
src_registry:
  ADDRESS: localhost:5000 // адрес src реестра (source)
  PASSWORD: null // password авторизации в докер реестр (если запрашивается)
  USERNAME: null // login авторизации в докер реестр (если запрашивается)
```

### Автоматическая синхронизация 
происходит по url - %server_address%/api/synchronize\
синхронизация всегда происходит с src реестра на dst\
с dst удаляются лишние теги, которых нет на dst\
на dst заливаются недостающие теги, которые есть на src\
Фильтровать теги и репозитории также можно в настройках синхронизации

### start.sh
При контейнера выполняется start.sh файл, где\
wrapdocker - оболочка для работы с докером внутри докера\
gunicorn - веб-сервер на python https://gunicorn.org/\
-w 4 - количество workers\
--bind - адрес веб-интерфейса внутри контейнера, порт любой\
--timeout - timeout ответа сервера в секундах
