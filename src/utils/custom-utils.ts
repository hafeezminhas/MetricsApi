class CustomUtils {

  public escapeRegex (str: string): any {
    return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }

  public randAlphaNumeric (length: number): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  public genearteSecurityCode () {
    return Math.floor(100000 + Math.random() * 900000);
  }
}

export { CustomUtils };
