import { IdleAntPage } from './app.po';

describe('idle-ant App', () => {
  let page: IdleAntPage;

  beforeEach(() => {
    page = new IdleAntPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
