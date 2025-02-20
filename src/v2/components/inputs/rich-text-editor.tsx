import React, { useState } from 'react';
import ReactQuill from 'react-quill-new';

import 'react-quill-new/dist/quill.snow.css';

interface Props {
    htmlValue: string;
    placeholder?: string;
    onChange: (value: string) => void;
}

export const RichTextEditor: React.FC<Props> = ({ htmlValue, onChange, placeholder }) => {
    const modules = {
        toolbar: [
            ['link'],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ size: [] }],
            [{ align: ['right', 'center', 'justify'] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
        ],
    };

    const formats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'link',
        'color',
        'image',
        'background',
        'align',
        'size',
        'font',
    ];

    const [editorValue, setEditorValue] = useState<string>(htmlValue);

    const handleProcedureContentChange = (value: string) => {
        setEditorValue(value);
        onChange(value);
    };

    return (
        <>
            <ReactQuill
                theme="snow"
                modules={modules}
                formats={formats}
                value={editorValue}
                placeholder={placeholder}
                onChange={handleProcedureContentChange}
            />
        </>
    );
};
