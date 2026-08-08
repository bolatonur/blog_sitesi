from flask import Flask, render_template, redirect, url_for, request, make_response, send_from_directory 
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime 
import re
import os
from dotenv import load_dotenv

load_dotenv()
ADMIN_SIFRE = os.getenv('ADMIN_SIFRE')

app = Flask(__name__)


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')





# --- başlığa göre url belirleme kısmı
def slugify(text):
    text = text.lower()
    # Türkçe karakterleri değiştirme
    chars = str.maketrans("şığüçö", "siguco")
    text = text.translate(chars)
    # Alfanümerik olmayanları sil ve boşlukları tire yap
    text = re.sub(r'[^\w\s-]', '', text).strip()
    return re.sub(r'[-\s]+', '-', text)




# --- ayların formatını düzeltme

def format_date(value):
    aylar = [
        "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
        "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
    ]
    gun = value.day
    ay = aylar[value.month - 1]
    yil = value.year
    return f"{gun} {ay} {yil}"

app.jinja_env.filters['tarih_formati'] = format_date




# --- AYARLAR ---
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///blog.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)



# --- VERİTABANI MODELİ ---

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    baslik = db.Column(db.String(100),  unique=True, nullable=False)
    slug = db.Column(db.String(150), nullable=False)
    yazar = db.Column(db.Text)
    kapak = db.Column(db.Text)
    ozet = db.Column(db.String(300))
    tarih = db.Column(db.DateTime, default=datetime.utcnow) 
    tiklanma = db.Column(db.Integer, default=0)
    parcalar = db.relationship('PostContent', backref='yazi', lazy=True, order_by="PostContent.sira")

class PostContent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    tip = db.Column(db.String(20))
    icerik = db.Column(db.Text)
    sira = db.Column(db.Integer)




# --- VERİTABANI OLUŞTURMA ---
with app.app_context():
    db.create_all()




# --- ROTALAR (ROUTES) ---

@app.route('/')
def home():
    all_posts = Post.query.order_by(Post.tarih.desc()).limit(3).all()
    bas_yazi = all_posts[0] if len(all_posts) > 0 else None
    diger_yazilar = all_posts[1:]
    
    populer = Post.query.order_by(Post.tiklanma.desc()).limit(2).all()
    
    return render_template('anasayfa.html', 
                           bas_yazi=bas_yazi, 
                           diger_yazilar=diger_yazilar, 
                           populer_yazilar=populer)


@app.route('/hakkimizda')
def hakkimizda():
    return render_template('hakkimizda.html')

@app.route('/bloglar')
def bloglar():
    yazilarim = Post.query.order_by(Post.tarih.desc()).all()
    return render_template('bloglar.html',yazilar=yazilarim)

@app.route('/yazarlar')
def yazarlar():
    yazilarim = Post.query.order_by(Post.tarih.desc()).all()
    return render_template('yazarlar.html',yazilar=yazilarim)

"""
@app.route('/sablon')
def sablon():
    return render_template('sablon.html')
"""


@app.route('/blog/<string:post_slug>')
def blog_detay(post_slug):

    yazi = Post.query.filter_by(slug=post_slug).first_or_404()
    
    # 1. Bu yazıya özel çerez ismini oluştur (Örn: okundu_merhaba-dunya)
    cerez_adi = f"okundu_{yazi.slug}"
    daha_once_okudu_mu = request.cookies.get(cerez_adi)

    # 2. Şablonu hazırlıyoruz ama hemen göndermiyoruz (çerez eklemek için bekletiyoruz)
    response = make_response(render_template('sablon.html', yazi=yazi))

    # 3. Eğer çerez yoksa tıklanmayı artır ve çerez ekle
    if not daha_once_okudu_mu:
        yazi.tiklanma += 1
        db.session.commit()
        
        # Kullanıcının tarayıcısına 10 günlük çerez
        response.set_cookie(cerez_adi, '1', max_age=60*60*24*10)
    
    return response


#--- YAZI EKLEME SEKMESİ ---
@app.route('/ekle', methods=['GET', 'POST'])
def yazi_ekle():
    if request.method == 'POST':
        girilen_sifre = request.form.get('admin_sifre')
        

        if girilen_sifre != ADMIN_SIFRE:
            return "Hatalı Şifre!", 403

        if 'baslik' in request.form:
            yeni_baslik = request.form.get('baslik')
            yeni_ozet = request.form.get('ozet')
            yeni_slug = slugify(yeni_baslik)
            yeni_kapak = request.form.get('kapak')
            yeni_yazar = request.form.get('yazar')

            yeni_post = Post(baslik=yeni_baslik, ozet=yeni_ozet, slug=yeni_slug, kapak=yeni_kapak, yazar=yeni_yazar)
            db.session.add(yeni_post)
            db.session.flush()
            
            tipler = request.form.getlist('block_type')
            icerikler = request.form.getlist('block_content')

            for i in range(len(tipler)):
                yeni_parca = PostContent(post_id=yeni_post.id, tip=tipler[i], icerik=icerikler[i], sira=i + 1)
                db.session.add(yeni_parca)

            db.session.commit()
            return redirect(url_for('home'))

        return render_template('ekle.html', admin_sifre=girilen_sifre)

    return '''
        <form method="post" style="text-align:center; margin-top:100px; font-family:sans-serif;">
            <h2>Yazı Ekleme Paneli</h2>
            <input type="password" name="admin_sifre" placeholder="Şifreyi gir" required 
                   style="padding:10px; border-radius:5px; border:1px solid #ccc;">
            <button type="submit" style="padding:10px 20px; cursor:pointer;">İlerle</button>
        </form>
    '''



#--- YAZI DÜZENLEME/SİLME SEKMESİ ---
@app.route('/duzenle', methods=['GET', 'POST'])
def duzenle():
    all_posts = Post.query.all()

    if request.method == 'POST':
        girilen_sifre = request.form.get('admin_sifre')
        if girilen_sifre != ADMIN_SIFRE:
            return "Hatalı Şifre!", 403

        secilen_yazi_id = request.form.get('post_id')
        yazi = Post.query.get(int(secilen_yazi_id))

        if not yazi:
            return "Yazı bulunamadı!", 404

        # SİLME İŞLEMİ
        if request.form.get('islem_tipi') == 'sil':
            PostContent.query.filter_by(post_id=yazi.id).delete()
            db.session.delete(yazi)
            db.session.commit()
            return redirect(url_for('home'))

        # GÜNCELLEME (ÜZERİNE YAZMA) İŞLEMİ
        if 'baslik' in request.form:
            yazi.baslik = request.form.get('baslik')
            yazi.ozet = request.form.get('ozet')
            yazi.kapak = request.form.get('kapak')
            yazi.yazar = request.form.get('yazar')
            yazi.slug = slugify(yazi.baslik)

            PostContent.query.filter_by(post_id=yazi.id).delete()
                        
            tipler = request.form.getlist('block_type')
            icerikler = request.form.getlist('block_content')
            for i in range(len(tipler)):
                yeni_parca = PostContent(post_id=yazi.id, tip=tipler[i], icerik=icerikler[i], sira=i + 1)
                db.session.add(yeni_parca)

            db.session.commit()
            return redirect(url_for('home'))

       
        bloklar = PostContent.query.filter_by(post_id=yazi.id).order_by(PostContent.sira).all()
        return render_template('duzenle.html', yazi=yazi, bloklar=bloklar, admin_sifre=girilen_sifre)

    return render_template('duzenle_secim.html', all_posts=all_posts)

# --- ÇALIŞTIRMA ---
if __name__ == '__main__':
    app.run(debug=True)