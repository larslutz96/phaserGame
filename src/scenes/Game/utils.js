function addCollider(groups, enemyGroup, physics) {
  groups.forEach((element) => {
    physics.add.collider(element.group, enemyGroup, element.action);
  });
}

function addTimers(timers, sceneTime) {
  timers.forEach((element) => {
    sceneTime.addEvent(element);
  });
}

export { addCollider, addTimers };
