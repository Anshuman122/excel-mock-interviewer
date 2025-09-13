
import streamlit as st
import requests

st.title("Excel Mock Interviewer")

if "session" not in st.session_state:
    st.session_state.session = None

if st.button("Start Interview"):
    st.session_state.session = "demo-session"
    st.write("Interview Started! Ask your first question...")

answer = st.text_input("Your Answer:")
if st.button("Submit Answer") and answer:
    st.write(f"Submitted: {answer}")
    # Later, send to backend using requests.post(...)
