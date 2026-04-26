# TrueSight AI - Media Integrity

TrueSight AI is an advanced, real-time media forensics dashboard designed to detect deepfakes, GAN-synthesized face generation, and digital manipulation. Powered by Google's Gemini 3.0 Pro Vision model, it analyzes media for pixel artifacts, lighting inconsistencies, and neural integrity scoring.

## Features

- **Deepfake & GAN Detection:** Verifies the authenticity of media elements quickly.
- **Cyber-forensics Interface:** An interactive, visually appealing UI inspired by top-tier security systems.
- **Real-time Camera Feed Analysis:** Take photos directly from your device camera and analyze them on the spot.
- **Detailed Forensic Output:** Provides confidence scores, artifact highlights, and contextual reasoning.

## How to Run Locally

Follow these steps to get this project up and running on your local machine:

### Prerequisites
- Node.js (v18 or higher recommended)
- A Gemini API Key from Google AI Studio.

### Installation

1. **Clone the repository** (if you have the git link) or download the files.
   ```bash
   git clone <repository_url>
   cd truesight-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a new file named `.env` in the root of the project and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   Visit `http://localhost:3000` (or the URL provided in your terminal) in your browser.

## Contact

**Developed by:** Dhruv Vaniawala  
**Contact:** [uwddhruv@gmail.com](mailto:uwddhruv@gmail.com)
