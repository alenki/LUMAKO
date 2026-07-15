import type { Metadata } from "next";
import Link from "next/link";
import { copy } from "@/lib/content/copy";
import { site } from "@/lib/content/site";
import { socialMeta } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: copy.meta.privacy.title,
  description: copy.meta.privacy.description,
  ...socialMeta({
    ogTitle: "Политика конфиденциальности | Lumako",
    description: copy.meta.privacy.description,
    path: "/privacy",
  }),
};

const bodyCls = "text-[length:var(--text-lg)] text-fg-body leading-relaxed";
const h2Cls =
  "font-display text-[length:var(--text-2xl)] font-semibold tracking-tight text-fg";

export default function PrivacyPage() {
  return (
    <section className="section-lg pt-[calc(var(--header-h)+var(--vw-8))]">
      <div className="container-x">
        <article className="mx-auto max-w-[68ch]">
          <header>
            <p className="label-caps">Правовая информация</p>
            <h1 className="mt-5 font-display text-[length:var(--text-5xl)] font-medium leading-[1.04] tracking-tight text-balance">
              {copy.meta.privacy.title}
            </h1>
            <p className="mt-5 text-[length:var(--text-base)] text-fg-dim">
              Редакция от 15.07.2026
            </p>
          </header>

          <div className="mt-12 space-y-12">
            <p className={bodyCls}>
              Настоящая Политика конфиденциальности (далее - Политика) определяет
              порядок обработки и защиты персональных данных пользователей сайта{" "}
              <span className="text-fg">lumako.ru</span> (далее - Сайт) и
              разработана в соответствии с Федеральным законом от 27.07.2006
              № 152-ФЗ «О персональных данных». Отправляя данные через форму
              обратной связи, вы подтверждаете согласие с условиями настоящей
              Политики.
            </p>

            <section>
              <h2 className={h2Cls}>1. Основные понятия</h2>
              <p className={`${bodyCls} mt-4`}>
                Персональные данные - любая информация, относящаяся к прямо или
                косвенно определённому физическому лицу (субъекту персональных
                данных). Обработка персональных данных - любое действие или
                совокупность действий, совершаемых с персональными данными, в том
                числе сбор, запись, хранение, использование, передача и удаление.
              </p>
            </section>

            <section>
              <h2 className={h2Cls}>2. Какие данные мы обрабатываем</h2>
              <p className={`${bodyCls} mt-4`}>
                Через форму обратной связи Оператор обрабатывает данные, которые
                вы предоставляете добровольно:
              </p>
              <ul className={`${bodyCls} mt-4 list-disc space-y-2 pl-6`}>
                <li>имя;</li>
                <li>адрес электронной почты;</li>
                <li>название компании (необязательно);</li>
                <li>сведения о проекте и ориентировочный бюджет;</li>
                <li>текст обращения.</li>
              </ul>
            </section>

            <section>
              <h2 className={h2Cls}>3. Цели обработки</h2>
              <p className={`${bodyCls} mt-4`}>
                Данные обрабатываются для обратной связи по вашему обращению,
                подготовки коммерческого предложения и дальнейшей коммуникации по
                проекту. Оператор не использует персональные данные для целей, не
                совместимых с указанными выше.
              </p>
            </section>

            <section>
              <h2 className={h2Cls}>4. Правовое основание</h2>
              <p className={`${bodyCls} mt-4`}>
                Обработка осуществляется на основании согласия субъекта
                персональных данных, которое вы даёте, отмечая соответствующий
                пункт в форме обратной связи, а также в соответствии с Федеральным
                законом № 152-ФЗ «О персональных данных».
              </p>
            </section>

            <section>
              <h2 className={h2Cls}>5. Порядок и сроки обработки</h2>
              <p className={`${bodyCls} mt-4`}>
                Обработка ведётся с использованием средств автоматизации.
                Персональные данные хранятся не дольше, чем этого требуют цели
                обработки, либо до отзыва вами согласия. После достижения целей
                или получения отзыва данные удаляются, если иное не предусмотрено
                законодательством Российской Федерации.
              </p>
            </section>

            <section>
              <h2 className={h2Cls}>6. Передача третьим лицам</h2>
              <p className={`${bodyCls} mt-4`}>
                Оператор не передаёт персональные данные третьим лицам, за
                исключением случаев, предусмотренных законом. Для доставки
                сообщений, отправленных через форму, используется сторонний сервис{" "}
                <a
                  href="https://web3forms.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor
                  className="font-medium text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-fg"
                >
                  Web3Forms
                </a>
                , который выступает исключительно каналом передачи сообщения на
                электронную почту Оператора.
              </p>
            </section>

            <section>
              <h2 className={h2Cls}>7. Файлы cookie</h2>
              <p className={`${bodyCls} mt-4`}>
                Сайт использует только технически необходимые файлы cookie,
                обеспечивающие его корректную работу. При подключении систем
                веб-аналитики соответствующие сведения будут отражены в настоящей
                Политике.
              </p>
            </section>

            <section>
              <h2 className={h2Cls}>8. Права субъекта персональных данных</h2>
              <p className={`${bodyCls} mt-4`}>
                Вы вправе получать сведения об обработке своих персональных
                данных, требовать их уточнения, блокирования или удаления, а также
                отозвать согласие на обработку. Для этого направьте обращение на
                адрес{" "}
                <a
                  href={`mailto:${site.email}`}
                  data-cursor
                  className="font-medium text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-fg"
                >
                  {site.email}
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className={h2Cls}>9. Защита данных</h2>
              <p className={`${bodyCls} mt-4`}>
                Оператор принимает необходимые организационные и технические меры
                для защиты персональных данных от неправомерного доступа,
                уничтожения, изменения, блокирования и иных неправомерных действий.
                Передача данных с Сайта осуществляется по защищённому соединению
                (HTTPS).
              </p>
            </section>

            <section>
              <h2 className={h2Cls}>10. Изменения Политики</h2>
              <p className={`${bodyCls} mt-4`}>
                Оператор вправе вносить изменения в настоящую Политику. Актуальная
                редакция всегда доступна на этой странице; дата последнего
                обновления указана в начале документа.
              </p>
            </section>

            <section>
              <h2 className={h2Cls}>11. Оператор и контакты</h2>
              <p className={`${bodyCls} mt-4`}>
                Оператор персональных данных - проект Lumako (lumako.ru). По любым
                вопросам, связанным с обработкой персональных данных, пишите на{" "}
                <a
                  href={`mailto:${site.email}`}
                  data-cursor
                  className="font-medium text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-fg"
                >
                  {site.email}
                </a>{" "}
                или через{" "}
                <Link
                  href="/contact"
                  data-cursor
                  className="font-medium text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-fg"
                >
                  форму обратной связи
                </Link>
                .
              </p>
            </section>
          </div>
        </article>
      </div>
    </section>
  );
}
