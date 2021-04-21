import { GetStaticProps } from "next";
import { format, parseISO } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import ptBR from "date-fns/locale/pt-BR";

import { api } from "../services/api";
import { converter } from "../utils/converDurantion";

import styles from "./home.module.scss";

type Episode = {
  id: string;
  title: string;
  members: string;
  published_at: string;
  thumbnail: string;
  description: string;
  durationAsString: string;
  duration: number;
  url: string;
  publishedAt: string;
};

type HomeProps = {
  latestEpisode: Episode[];
  allEpisodios: Episode[];
};

export default function Home({ latestEpisode, allEpisodios }: HomeProps) {
  return (
    <div className={styles.homePage}>
      <section className={styles.latestEpisode}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {latestEpisode.map((el) => {
            return (
              <li key={el.id}>
                <Image
                  width={192}
                  height={192}
                  src={el.thumbnail}
                  alt={el.title}
                  objectFit="cover"
                />

                <div className={styles.detailsEpisode}>
                  <Link href={`/episode/${el.id}`}>
                    <a>{el.title}</a>
                  </Link>

                  <p>{el.members}</p>
                  <span>{el.publishedAt}</span>
                  <span>{el.durationAsString}</span>
                </div>

                <button type="button">
                  <img src="/play-green.svg" alt="Play" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={styles.allEpisode}>
        <h2>Todos episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
            <th></th>
            <th>Podcast</th>
            <th>Integrantes</th>
            <th>Data</th>
            <th>Duração</th>
            <th></th>
            </tr>
          </thead>

          <tbody>
            {allEpisodios.map((el) => {
              return (
                <tr key={el.id}>
                  <td style={{ width: 120 }}>
                    <Image
                      width={120}
                      height={120}
                      src={el.thumbnail}
                      alt={el.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episode/${el.id}`}>
                      <a>{el.title}</a>
                    </Link>
                  </td>
                  <td>{el.members}</td>
                  <td style={{ width: 120 }}>{el.publishedAt}</td>
                  <td>{el.durationAsString}</td>
                  <td>
                    <button type="button">
                      <img src="/play-green.svg" alt="Play" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get("episodes", {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc",
    },
  });

  const episodes = data.map((el) => {
    return {
      id: el.id,
      title: el.title,
      thumbnail: el.thumbnail,
      members: el.members,
      publishedAt: format(parseISO(el.published_at), "d MMM yy", {
        locale: ptBR,
      }),
      duration: Number(el.file.durantion),
      durationAsString: converter(Number(el.file.duration)),
      description: el.description,
      url: el.file.url,
    };
  });

  const latestEpisode = episodes.slice(0, 2);
  const allEpisodios = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisode,
      allEpisodios,
    },
    revalidate: 60 * 60 * 8,
  };
};
