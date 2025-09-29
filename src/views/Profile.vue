<template>

    <div class="profile-container">
        <div class="bg-overlay" />

        <section class="profile-card glass">
            <div class="header">
                <img src="/image/头像.jpg" alt="avatar" class="avatar" />
                <div class="info">
                    <h1>shi yu</h1>
                    <p class="title">学生</p>
                    <p class="row">
                        <ion-icon name="location"></ion-icon>
                        黑龙江省-双鸭山市, China
                    </p>
                    <p class="row">
                        <ion-icon name="mail"></ion-icon>
                        18204696708@163.com
                    </p>
                    <p class="row">
                        <ion-icon name="mail"></ion-icon>
                        2521393424@qq.com
                    </p>
                </div>
            </div>

            <div class="bio">
                <p>大数据专业在读生，通过自学掌握 HTML/CSS/JavaScript 开发。</p>
                <p>使用 Vue3 框架构建网站，持续学习前端工程化实践。</p>
            </div>

            <div class="social">
                <a href="https://github.com/shiyu1209/shiyu1209.github.io" class="btn">
                    <ion-icon name="logo-github"></ion-icon> GitHub
                </a>
                <a href="https://space.bilibili.com/361703124" class="btn">
                    <ion-icon name="logo-youtube"></ion-icon> Bilibili
                </a>
                <a href="https://email.163.com/" class="btn">
                    <ion-icon name="mail"></ion-icon> Email
                </a>
            </div>
        </section>

        <section class="projects glass">
            <h2>Projects</h2>
            <div class="grid">
                <article class="card">
                    <h3>我的个人网站</h3>
                    <p>使用 Vue3 构建的网站</p>
                    <a href="https://shiyu1209.github.io/" class="link">查看项目 →</a>
                </article>
                <article class="card">
                    <h3>个人简历</h3>
                    <p>点击查看我的个人简历</p>
                    <a href="/image/简历.pdf" class="link">查看项目 →</a>
                </article>
                <article class="card">
                    <h3>其他内容</h3>
                    <p>其他内容正在更新中...</p>
                    <a class="link">查看项目 →</a>
                </article>
            </div>
        </section>
    </div>

</template>

<script setup>
import TheNavigation from '@/components/TopNav.vue'
</script>

<style scoped>
.profile-container {
    min-height: 100vh;
    padding: 2rem;
    position: relative;
    color: #000;
}

.profile-root {
  min-height: 100vh;        /* 允许撑出滚动条 */
  padding: 2rem;
  color: #fff;
}

.bg-overlay {
    position: fixed;
    inset: 0;
    background: rgba(255, 255, 255, .3);
    backdrop-filter: blur(8px);
    z-index: 0;
}

.glass {
    background: rgba(255, 255, 255, .1);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, .2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, .2);
    position: relative;
    z-index: 1;
}

.profile-card {
    max-width: 1000px;
    margin: 0 auto 2rem;
    padding: 2.5rem;
}

.header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
}

.avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #000;
}

.info h1 {
    font-size: 2rem;
    margin-bottom: .5rem;
}

.title {
    color: #000;
    margin-bottom: .5rem;
}

.row {
    display: flex;
    align-items: center;
    gap: .5rem;
    margin: .3rem 0;
}

.bio {
    line-height: 1.8;
    margin-bottom: 2rem;
}

.social {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

.btn {
    display: flex;
    align-items: center;
    gap: .5rem;
    padding: .8rem 1.5rem;
    background: rgba(255, 255, 255, .1);
    color: #000;
    border-radius: 50px;
    text-decoration: none;
    transition: .3s;
    border: 1px solid rgba(255, 255, 255, .2);
}

.btn:hover {
    background: rgba(255, 255, 255, .2);
    transform: translateY(-2px);
}

.projects {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem;
}

.projects h2 {
    text-align: center;
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
}

.card {
    padding: 1.8rem;
    border-radius: 12px;
    background: rgba(255, 255, 255, .05);
    transition: .3s;
    border: 1px solid rgba(255, 255, 255, .1);
}

.card:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, .1);
}

.card h3 {
    margin-bottom: .8rem;
    color: #000;
}

.card p {
    margin-bottom: 1rem;
    line-height: 1.6;
}

.link {
    color: #000;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: .5rem;
    transition: .2s;
}

.link:hover {
    gap: 1rem;
}
</style>