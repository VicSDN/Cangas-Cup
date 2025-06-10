import { useEffect, useState } from 'react';

const tagsConfig = [
  'Clasificación',
  'Rankings',
  'Horarios y Resultados',
  'El Salón de los Elegidos',
];

interface CompetitionViewProps {
  initialTag?: string;
  initialSubtag?: string | null;
  availableGroupNames: string[];
  year: number;
}

export default function CompetitionView({
  availableGroupNames,
  year,
  initialTag: initialTagFromProp,
  initialSubtag: initialSubtagFromProp,
}: CompetitionViewProps) {
  const subtagsMapConfig: Record<string, string[]> = {
    Clasificación: availableGroupNames,
    Rankings: ['Máx. Goleadores', 'Tarjetas Amarillas', 'Tarjetas Rojas', 'MVPs'],
    'Horarios y Resultados': ['Horarios de Grupos', 'Eliminatoria', 'Final Local'],
  };

  const [currentTag, setCurrentTag] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tagFromUrl = params.get('tag');
      if (tagFromUrl && tagsConfig.includes(tagFromUrl)) {
        return tagFromUrl;
      }
    }
    return initialTagFromProp || tagsConfig[0];
  });

  const [currentSubtag, setCurrentSubtag] = useState<string | null>(() => {
    let subtagToSet: string | null = null;
    const effectiveTag = currentTag;

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const subtagFromUrl = params.get('subtag');
      const validSubtagsForCurrentTag = subtagsMapConfig[effectiveTag] || [];
      if (subtagFromUrl && validSubtagsForCurrentTag.includes(subtagFromUrl)) {
        subtagToSet = subtagFromUrl;
      }
    }

    if (subtagToSet === null) {
      const validSubtagsForInitialTagProp =
        subtagsMapConfig[initialTagFromProp || effectiveTag] || [];
      if (initialSubtagFromProp && validSubtagsForInitialTagProp.includes(initialSubtagFromProp)) {
        subtagToSet = initialSubtagFromProp;
      } else if (validSubtagsForInitialTagProp.length > 0) {
        subtagToSet = validSubtagsForInitialTagProp[0];
      }
    }
    const finalValidSubtags = subtagsMapConfig[effectiveTag] || [];
    if (subtagToSet && finalValidSubtags.includes(subtagToSet)) {
      return subtagToSet;
    }
    return finalValidSubtags.length > 0 ? finalValidSubtags[0] : null;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      let urlNeedsUpdate = false;

      const currentUrlTag = params.get('tag');
      const currentUrlSubtag = params.get('subtag');

      if (currentUrlTag !== currentTag) {
        params.set('tag', currentTag);
        urlNeedsUpdate = true;
      }

      if (currentSubtag) {
        if (currentUrlSubtag !== currentSubtag) {
          params.set('subtag', currentSubtag);
          urlNeedsUpdate = true;
        }
      } else {
        if (params.has('subtag')) {
          params.delete('subtag');
          urlNeedsUpdate = true;
        }
      }

      if (urlNeedsUpdate) {
        window.location.search = params.toString();
      }
    }
  }, [currentTag, currentSubtag]);

  useEffect(() => {
    const tagFromProp = initialTagFromProp || tagsConfig[0];
    if (currentTag !== tagFromProp) {
      setCurrentTag(tagFromProp);
    }

    const subtagsForTagFromProp = subtagsMapConfig[tagFromProp] || [];
    let newSubtagFromProp: string | null = null;

    if (initialSubtagFromProp && subtagsForTagFromProp.includes(initialSubtagFromProp)) {
      newSubtagFromProp = initialSubtagFromProp;
    } else if (subtagsForTagFromProp.length > 0) {
      newSubtagFromProp = subtagsForTagFromProp[0];
    }

    if (currentSubtag !== newSubtagFromProp) {
      setCurrentSubtag(newSubtagFromProp);
    }
  }, [initialTagFromProp, initialSubtagFromProp, availableGroupNames]);

  const handleTagClick = (tag: string) => {
    setCurrentTag(tag);
    const newSubtags = subtagsMapConfig[tag] || [];
    setCurrentSubtag(newSubtags.length > 0 ? newSubtags[0] : null);
  };

  const handleSubtagClick = (subtag: string) => {
    setCurrentSubtag(subtag);
  };

  const subtagsForCurrentTag = subtagsMapConfig[currentTag] || [];

  return (
    <div className="mb-8 p-4 md:p-6 bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-xl shadow-2xl">
      <div className="flex flex-wrap gap-3 mb-5 border-b border-gray-700 pb-5 justify-center">
        {tagsConfig.map((t) => (
          <button
            key={t}
            onClick={() => handleTagClick(t)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800
              ${
                currentTag === t
                  ? 'bg-sky-500 text-white shadow-lg ring-2 ring-sky-300'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
              }`}
          >
            {t}
          </button>
        ))}
      </div>

      {subtagsForCurrentTag.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {subtagsForCurrentTag.map((s) => (
            <button
              key={s}
              onClick={() => handleSubtagClick(s)}
              className={`px-4 py-2 rounded-md text-xs font-medium transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-1
                ${
                  currentSubtag === s
                    ? 'bg-sky-600 text-white shadow-md ring-sky-400'
                    : 'bg-gray-600 text-gray-400 hover:bg-gray-500 hover:text-gray-200 ring-gray-700'
                }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}
      {availableGroupNames.length === 0 && currentTag === 'Clasificación' && (
        <p className="mt-4 text-sm text-yellow-400 text-center">
          No hay grupos configurados para este año en la sección Clasificación.
        </p>
      )}
    </div>
  );
}
