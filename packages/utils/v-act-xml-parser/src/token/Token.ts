abstract class Token {
  static getWeight() {
    return 0
  }
  static newInstance(str: string, index: number): Token | null {
    return null
  }
  abstract getPosition(): number
  abstract isMatch(str: string, index: number): boolean
  abstract getOffset(): number
}
export default Token
