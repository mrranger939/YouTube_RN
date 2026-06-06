import os

import subprocess

from app.utils.env import gpu_config



def generate_hls(input_file):
    """Generate HLS playlist and segments using FFmpeg."""
    output_dir = f"../tmp/{os.path.splitext(os.path.basename(input_file))[0]}_hls"
    os.makedirs(output_dir, exist_ok=True)

    print(output_dir)
    try:
         # Transcoding video to multiple resolutions for ABR
        resolutions = {
            "360p": {"scale": "640:360", "video_bitrate": "800k", "audio_bitrate": "128k"},
            "720p": {"scale": "1280:720", "video_bitrate": "2500k", "audio_bitrate": "128k"},
            "1080p": {"scale": "1920:1080", "video_bitrate": "4500k", "audio_bitrate": "192k"}
        }

        playlists = []

        for resolution, settings in resolutions.items():
            output_m3u8 = f"{output_dir}/{resolution}.m3u8"
            if gpu_config == "NVIDIA":
                command = (
                f"ffmpeg -hwaccel cuda -hwaccel_output_format cuda -i {input_file} "
                f"-vf scale_cuda={settings['scale']} -c:a aac -ar 48000 "
                f"-b:a {settings['audio_bitrate']} -c:v h264_nvenc  "
                f"-crf 20 -g 48 -keyint_min 48 -hls_time 10 -hls_playlist_type vod "
                f"-b:v {settings['video_bitrate']} -maxrate {settings['video_bitrate']} -bufsize 2000k "
                f"-hls_segment_filename {output_dir}/{resolution}_%03d.ts {output_m3u8}"
                )
            else :
                command = (
                f"ffmpeg -hwaccel auto -i {input_file} -vf scale={settings['scale']} -c:a aac -ar 48000 "
                f"-b:a {settings['audio_bitrate']} -c:v h264 -profile:v main -crf 20 "
                f"-sc_threshold 0 -g 48 -keyint_min 48 -hls_time 10 -hls_playlist_type vod "
                f"-b:v {settings['video_bitrate']} -maxrate {settings['video_bitrate']} -bufsize 2000k "
                f"-hls_segment_filename {output_dir}/{resolution}_%03d.ts {output_m3u8}"
                )
            print(f"Running command: {command}")  # Debugging
            process = subprocess.run(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

            if process.returncode != 0:
                print(f"Error creating {resolution}: {process.stderr}")
                return output_dir,f"FFmpeg error for {resolution}: {process.stderr}"

            resolution_split = settings['scale'].split(':')  # Split width and height
            playlists.append(
                f"#EXT-X-STREAM-INF:BANDWIDTH={settings['video_bitrate'].strip('k')}000,RESOLUTION={resolution_split[0]}x{resolution_split[1]}\n{resolution}.m3u8"
            )



        # Create a master playlist
        master_playlist_path = os.path.join(output_dir, "master.m3u8")
        with open(master_playlist_path, 'w') as master_playlist:
            master_playlist.write("#EXTM3U\n")
            master_playlist.write("\n".join(playlists))
            
        if os.path.exists(master_playlist_path):
            print(f"HLS playlist generated: {master_playlist_path}")
            return output_dir,None
        else:
            print("Error: HLS playlist not generated.")
            return output_dir, "Error: HLS playlist not generated."
    except Exception as e:
        print(f"Error during HLS generation: {str(e)}")
        return output_dir,f"Error during HLS generation: {str(e)}"
    return None
