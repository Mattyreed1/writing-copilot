export default class ResourceResults {
  constructor(resources) {
    this.resources = resources;
  }

  render() {
    const container = document.createElement('div');
    container.className = 'resource-results';

    const title = document.createElement('h2');
    title.textContent = 'Suggested Resources';
    container.appendChild(title);

    this.resources.forEach((resource, index) => {
      const resourceElement = document.createElement('div');
      resourceElement.className = 'resource-item';
      resourceElement.innerHTML = `
        <a href="${resource.url}">${resource.name}</a>
        <p class="explanation">Why this resource is relevant</p>
      `;
      container.appendChild(resourceElement);
    });

    const addButton = document.createElement('button');
    addButton.textContent = 'ADD RESOURCES';
    addButton.onclick = this.addResources.bind(this);
    container.appendChild(addButton);

    return container;
  }

  addResources() {
    // Implement the logic to add the resources
    console.log('Adding resources');
  }
}