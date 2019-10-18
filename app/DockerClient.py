import docker
from log import log

from schema import SCHEMA


class DockerClient:
    ADDRESS = 'unix://var/run/docker.sock'

    def __init__(self):
        self.client = docker.DockerClient(base_url=self.ADDRESS)

    def login(self, address='', username='', password=''):
        address = SCHEMA + address
        print(log('Docker client log into ' + address + ' login:' + str(username) + ' password:' + str(password)))
        self.client.login(registry=address, username=username, password=password)

    def images_list(self):
        images_list = self.client.images.list()
        return images_list

    def get_image(self, image_id):
        image = self.client.images.get(image_id)
        return image

    def remove_image(self, image):
        self.client.images.remove(image)
        print(log('Docker client remove image ' + image))
        return True

    def pull_image(self, src, repo, tag):
        repo = src + '/' + repo
        self.client.images.pull(repository=repo, tag=tag)
        repo_tag = repo + ':' + tag
        print(log('Docker client pull image ' + repo_tag))
        return repo_tag

    def push_image(self, repo, tag):
        output = self.client.images.push(repository=repo, tag=tag)
        print(log('Docker client push image ' + repo + ':' + tag + ' Output: ' + output))

        return True
