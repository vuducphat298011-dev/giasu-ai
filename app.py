import streamlit as st
from google import genai

st.set_page_config(
    page_title="Gia Sư AI Mobile",
    page_icon="📚",
    layout="centered"
)

st.title("📚 Gia Sư AI - Trợ Lý Học Tập")
st.write("Hỏi đáp mọi thắc mắc học tập cùng Gemini ngay trên điện thoại!")

api_key = st.text_input("Nhập Google AI Studio API Key:", type="password")

if not api_key:
    st.info("💡 Vui lòng nhập API Key để bắt đầu trò chuyện với gia sư AI.")
    st.stop()

client = genai.Client(api_key=api_key)

system_instruction = """
Bạn là một "Gia sư AI" thân thiện, kiên sinh và uyên bác. 
Nhiệm vụ của bạn là hỗ trợ học sinh, sinh viên giải đáp thắc mắc về mọi môn học.
- Giải thích khái niệm đơn giản, dễ hiểu, kèm ví dụ thực tế.
- Hướng dẫn tư duy từng bước khi giải bài tập thay vì chỉ cho đáp án ngay.
"""

if "chat_session" not in st.session_state:
    st.session_state.chat_session = client.chats.create(
        model="gemini-2.5-flash",
        config={
            "system_instruction": system_instruction,
            "temperature": 0.7,
        }
    )

for message in st.session_state.chat_session.get_history():
    role = "user" if message.role == "user" else "assistant"
    with st.chat_message(role):
        st.markdown(message.parts[0].text)

if prompt := st.chat_input("Nhập câu hỏi của bạn vào đây..."):
    with st.chat_message("user"):
        st.markdown(prompt)
    
    with st.chat_message("assistant"):
        with st.spinner("AI đang giải thích..."):
            try:
                response = st.session_state.chat_session.send_message(prompt)
                st.markdown(response.text)
            except Exception as e:
                st.error(f"Lỗi: {e}")
